import { BaseService, urlState } from 'bi-internal/core';
import { IPresentationModel, IRawPresentation } from '../models';
import {
  PresentationsListService,
  IPresentationsListModel,
  PresentationModel,
} from 'bi-internal/services';
import { SlidesListService } from 'bi-internal/services';
import { getBookmarksManager } from '../_bookmarks-manager';
import { $eid } from 'bi-internal/utils';
import { DsStateService } from 'bi-internal/services';
import { IDsState } from 'bi-internal/services';
import { shell } from 'bi-internal/services';
import { lang, oneEntity } from 'bi-internal/utils';
import { AlertsVC } from 'bi-internal/ui';
import AddBookmarkDialog from '../views/AddBookmarkDialog';


const FAKE_ID: number = -1;


const FAKE_RAW_PRESENTATION: IRawPresentation = {
  id: FAKE_ID,
  topic_type: 'presentation',
  title: '',
  description: '',
  parent_id: null,
  user_id: 0,
  config: {},
  created: '',
  updated: '',
  _is_mine: true,
  users: [],
};


class FakeFolder extends PresentationModel {
  public isNew: boolean = true;

  constructor() {
    super(FAKE_RAW_PRESENTATION);
  }
}


export interface IAddBookmarkDialogVM {
  loading?: boolean;
  error?: string;
  // viewClassId: '@presentations/views/AddBookmarkDialog';
  viewClass: any;
  isFoldersOpened: boolean;
  initialTitle: string;
  activeFolderId: number | null;
  folders: IPresentationModel[];
  // events
  onSaveAndClose?: (bookmarkName: string, bookmarkDescription: string) => void;
  onClose?: () => void;
  onToggleFolders?: () => void;
  onCreateFolder?: () => void;
  onSelectFolder?: (folder: IPresentationModel) => void;
  onNewFolderTitleChange?: (title: string) => void;
}


export class AddBookmarkDialogVC extends BaseService<IAddBookmarkDialogVM> {
  private _presentationsListService: PresentationsListService;
  private _newFolder: FakeFolder = null;

  public constructor() {
    super({
      loading: true,
      error: null,
      // viewClassId: '@presentations/views/AddBookmarkDialog',
      viewClass: AddBookmarkDialog,
      isFoldersOpened: false,
      activeFolderId: null,
      folders: [],
      initialTitle: '',
      //
      onSaveAndClose: (bookmarkName: string, bookmarkDescription: string) => this._onSaveAndClose(bookmarkName, bookmarkDescription),
      onClose: () => this._onClose(),
      onToggleFolders: () => this._onToggleFolders(),
      onCreateFolder: () => this._onCreateFolder(),
      onSelectFolder: (folder: IPresentationModel) => this._onSelectFolder(folder),
      onNewFolderTitleChange: (title: string) => this._onNewFolderTitleChange(title),
    });

    this._presentationsListService = PresentationsListService.getInstance();
    this._subscriptions.push(this._presentationsListService.subscribeUpdatesAndNotify((presentationsListModel: IPresentationsListModel) => {   // deps updates
      if (presentationsListModel.error) return this._updateModel({error: presentationsListModel.error, loading: false});
      if (presentationsListModel.loading) return;

      let folders: IPresentationModel[] = presentationsListModel.presentations.slice(0);       // .filter((presentation: PresentationModel) => presentation.isMine);   // issue 2484: all presentations for saving
      if (this._newFolder) {
        folders.push(this._newFolder);
      }
      this._updateModel({folders, loading: false, error: null});
    }));
  }

  public async onBeforeShow() {
    let initialTitle: string = '';

    this._cleanupNewFolder();

    const shellContext = shell.getCurrentContext();
    const schemaName: string = shellContext.segmentId;

    let dsStateService: DsStateService = null;
    try {
      dsStateService = DsStateService.createInstance(schemaName);
      await dsStateService.whenReady();
      const dsState: IDsState = dsStateService.getModel();

      if (dsState.route === '#dashboards' && dsState.dboard) {
        initialTitle = this._getDashboardTitle(dsState) || '';
      }
      this._updateModel({
        activeFolderId: null,
        initialTitle,
      });

    } finally {
      if (dsStateService) {
        dsStateService.release();
        dsStateService = null;
      }
    }
  }

  private _getDashboardTitle(d: IDsState): string {
    const repl: {[r: string]: string} = {                                       // replace %m %l %p
      m: d.metrics.length ? oneEntity(d.metrics).title : '',
      l: d.locations.length ? oneEntity(d.locations).title : '',
      p: d.periods.length ? oneEntity(d.periods).title : '',
    };

    return d.dboard.title.replace(/%(\d*)([mlp])/g, function (fld, number, entityName) {
      if (number) {
        const n: number = parseInt(number);
        let s: string = repl[entityName];
        if (s.length > number) s = s.substr(0, n - 3) + '...';
        return s;
      } else {
        return repl[entityName];
      }
    });
  }

  private async _onSaveAndClose(bookmarkName: string, bookmarkDescription: string): Promise<any> {
    let dsStateService: DsStateService = null;

    try {
      // SL-730 проверка на то, что есть название и выбрана презентация, если одно из условий не соблюдается, то выходим
      if (!bookmarkName || this._model.activeFolderId === null) {
        return;
      }
      const context: any = shell.getCurrentContext();
      /* Подумать над добавлением нового конструктора ds_48 */
      if(urlState.getModel().metrics.length === 0 && [`ds_44`, `ds_45`, `ds_46`].includes(context.dataset)) {
        AlertsVC.getInstance().pushDangerAlert(`Для добавления экрана в шаблон выберите один или несколько показателей`);
        return ;
      }
      this._updateModel({error: null});

      const schemaName: string = context.segmentId;
      const title: string = bookmarkName;
      const description: string = bookmarkDescription;
      const url: string = '/' + urlState.buildUrl({});

      dsStateService = DsStateService.createInstance(schemaName);
      await dsStateService.whenReady();

      if (this._model.activeFolderId !== null) {
        let folder: IPresentationModel = $eid(this._model.folders, this._model.activeFolderId);
        this._cleanupNewFolder();

        if (folder instanceof FakeFolder) {
          folder = await this._presentationsListService.createPresentation(folder.title);
          this._onSelectFolder(folder);
          localStorage.setItem(`hasNewPresentations`, folder.created.toString());
        }

        let sSvc: SlidesListService;
        try {
          sSvc = SlidesListService.createInstance(folder.id);
          await sSvc.whenReady();
          await sSvc.createSlide(dsStateService.getDataset().id, title, description, url, context);
        } finally {
          if (sSvc) sSvc.release();
        }

      } else {
        let payload: any = {
          title: bookmarkName,
          description: bookmarkDescription,
          // url: url,
          full_url: url,
          context: context,
        };
        await getBookmarksManager().createBookmark(schemaName, payload);
      }

      this._onClose();

    } catch (err) {
      this._updateModel({
        // error: extractErrorMessage(err)
        error: lang('error-saving-bookmark'),
      });
    } finally {
      if (dsStateService) {
        dsStateService.release();
        dsStateService = null;
      }
    }
  }

  private _onClose() {
    this._updateModel({
      error: null,
      loading: false,
    });
    this._notify('close');
  }

  private _onToggleFolders(): void {
    this._updateModel({isFoldersOpened: !this._model.isFoldersOpened});
  }

  private _onSelectFolder(folder: IPresentationModel): void {
    const activeFolderId: number | null = folder ? folder.id : null;
    this._updateModel({activeFolderId});
  }

  private _cleanupNewFolder(): void {
    if (!this._newFolder) {
      return;
    }
    let {folders, activeFolderId} = this._model;

    if (activeFolderId === FAKE_ID) {
      activeFolderId = null;
    }

    const idx: number = folders.indexOf(this._newFolder);
    if (idx !== -1) {
      folders = folders.slice(0);
      folders.splice(idx, 1);
    }

    this._newFolder = null;
    this._updateModel({activeFolderId, folders});
    // this._$container.removeClass('creating-folder');
  }

  private _onCreateFolder(): void {
    if (this._newFolder) {
      return;
    }
    this._newFolder = new FakeFolder();

    let {folders, activeFolderId} = this._model;

    folders = folders.slice(0);
    folders.push(this._newFolder);
    activeFolderId = FAKE_ID;

    this._updateModel({folders, activeFolderId});

    // let activateInput = () => {
    //   let $foldersList = this._$container.find('.folders-list');
    //   $foldersList.animate({
    //     scrollTop: $foldersList.height() + 10,
    //   }, 300);
    //   window.setTimeout(() => {
    //     $foldersList.find('input').focus();
    //   }, 300);
    // };
    // this._$container.addClass('creating-folder');
    // window.setTimeout(activateInput, 250);
  }

  private _onNewFolderTitleChange(title: string) {
    if (!this._newFolder) {
      return;
    }
    let {folders} = this._model;

    folders = folders.slice(0);
    const idx = folders.indexOf(this._newFolder);
    if (idx === -1) {
      return;
    }
    this._newFolder = new FakeFolder();
    this._newFolder.title = title;
    folders[idx] = this._newFolder;
    this._updateModel({folders});
  }
}
