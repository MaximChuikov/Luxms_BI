/**
 *  Presentations plugin
 *  defines plugin entry point
 *
 */


import * as React from 'react';
import * as ReactDOM from 'react-dom';
import cn from 'classnames';
import PresentationsListPage from './PresentationsListView';
import { PresentationsListService, IPresentationsListModel } from 'bi-internal/services';
import { IPresentationModel } from './models';
import { BaseService, IDisposable, urlState } from 'bi-internal/core';
import { AddBookmarkDialogVC } from './view-controllers/AddBookmarkDialogVC';
import { PopupVC } from 'bi-internal/services';
import { IDsState } from 'bi-internal/services';
import { $eid } from 'bi-internal/utils';
import { lang } from 'bi-internal/utils';
import { DsStateService } from 'bi-internal/services';
import { IDsToolbarButton } from '../plugins-model';

function hasClass(el: HTMLElement, className: string): boolean {
  let elClassName = el.className || '';
  if (typeof elClassName !== 'string') {
    elClassName = el.getAttribute('class') || '';
  }
  const classNames: string[] = elClassName.split(' ');
  return (classNames.indexOf(className) !== -1);
}

function getParentsList(el: HTMLElement, includeSelf: boolean = false): HTMLElement[] {
  let result: HTMLElement[] = [];
  if (includeSelf) {
    result.push(el);
  }
  while ((el = el.parentElement)) {
    result.push(el);
  }
  return result;
}


function getParentWithClass(el: HTMLElement, className: string, includeSelf: boolean = false): HTMLElement {
  const parents: HTMLElement[] = getParentsList(el, includeSelf);
  return parents.find(p => hasClass(p, className));
}


interface IDisplayPresentationsModel extends IPresentationsListModel {
  activePresentation: any;
}


export class PresentationsTabContent extends React.Component<any, IDisplayPresentationsModel> {
  private _presentationsService: PresentationsListService = null;
  private _subscriptions: IDisposable[] = [];
  public state: IDisplayPresentationsModel;

  public constructor(props) {
    super(props);
    this._presentationsService = PresentationsListService.getInstance();
    const model: IPresentationsListModel = this._presentationsService.getModel();
    const activePresentationId: string = urlState.getModel().segmentId;
    const activePresentation: IPresentationModel = $eid(model.presentations, activePresentationId);
    this.state = {
      ...model,
      activePresentation,
    };
  }

  public componentDidMount() {
    this._subscriptions.push(urlState.subscribe('segmentId', this._serviceUpdated));
    this._subscriptions.push(this._presentationsService.subscribeUpdatesAndNotify(this._serviceUpdated));
  }

  public componentWillUnmount() {
    this._subscriptions.forEach(s => s.dispose());
    this._subscriptions = [];
  }

  private _serviceUpdated = () => {
    console.assert(!!this._presentationsService);
    const activePresentationId: string = urlState.getModel().segmentId;
    const model: IPresentationsListModel = this._presentationsService.getModel();
    const activePresentation: IPresentationModel = $eid(model.presentations, activePresentationId);

    this.setState({
      ...model,
      activePresentation,
    });
  };

  private _onUnsharePress = (presentation: IPresentationModel, user: User) => {
    PresentationsListService.getInstance().unsharePresentationWithUser(presentation, user);
  };


  public render() {
    const {presentations, activePresentation, loading, error} = this.state;

    return (
      <PresentationsListPage presentations={presentations}
                             loading={loading}
                             error={error}
                             activePresentation={activePresentation}
                             selectPresentation={this._handleSelectPresentation}
                             onUnsharePress={this._onUnsharePress} />);
  }

  private _handleSelectPresentation = (presentation: IPresentationModel): void => {
    urlState.navigate({
      segment: 'presentations',
      segmentId: presentation ? presentation.id : null,
    });
  }
}


export class SaveSlideToolbarButtonVC extends BaseService<IDsToolbarButton> {
  private _addBookmarkDialogVC: AddBookmarkDialogVC;
  private _dsStateService: DsStateService;
  private _prevDsState: IDsState;

  public constructor(schemaName: string) {
    super({
      title: lang('save-bookmark'),
      className: '',
      icon: 'toolbar/favorites',
      active: false,
      href: null,
      onPress: (event) => this._onPress(event),
    });

    this._dsStateService = DsStateService.createInstance(schemaName);
    this._prevDsState = this._dsStateService.getModel();
    this._subscriptions.push(this._dsStateService.subscribeUpdates(this._onXDepsUpdated));
    // TODO: subscribe on dataset change
  }

  protected _onXDepsUpdated = (dsState: IDsState) => {
    // close on route changed
    if (this._prevDsState.route !== dsState.route /* || this._url.segment !== url.segment */) {
      if (this._model.active) {
        this._updateModel({active: false});
        PopupVC.hideDialog(this._addBookmarkDialogVC);
      }
    }
    this._prevDsState = dsState;
  };

  private _onPress = async (event): Promise<void> => {
    if (!this._addBookmarkDialogVC) {
      this._addBookmarkDialogVC = new AddBookmarkDialogVC();
    }

    const isOpened: boolean = this._model.active;

    if (isOpened) {
      this._updateModel({active: false});
      PopupVC.hideDialog(this._addBookmarkDialogVC);

    } else {
      this._updateModel({active: true});
      this._addBookmarkDialogVC.onBeforeShow();             // reinitialize
      const el: HTMLElement = getParentWithClass(event.target, 'MainToolbar__Button', true);
      let elementRect = el.getBoundingClientRect();
      PopupVC.showDialog(this._addBookmarkDialogVC,
        {right: elementRect.right, top: elementRect.bottom},
        () => {
          this._updateModel({active: false});
        });
    }
  };

  protected _dispose() {
    if (this._model.active) {
      PopupVC.hideDialog(this._addBookmarkDialogVC);
    }

    this._dsStateService.release();
    this._dsStateService = null;
    super._dispose();
  }
}


export class NavigatePresentationButtonVC extends BaseService<IDsToolbarButton> {
  public constructor() {
    super({
      title: 'Перейти в список шаблонов',
      className: '',
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 12H26C27.1 12 28 11.1 28 10C28 8.9 27.1 8 26 8H18C16.9 8 16 8.9 16 10C16 11.1 16.9 12 18 12ZM18 20H26C27.1 20 28 19.1 28 18C28 16.9 27.1 16 26 16H18C16.9 16 16 16.9 16 18C16 19.1 16.9 20 18 20ZM18 28H26C27.1 28 28 27.1 28 26C28 24.9 27.1 24 26 24H18C16.9 24 16 24.9 16 26C16 27.1 16.9 28 18 28ZM8 8H12V12H8V8ZM8 16H12V20H8V16ZM8 24H12V28H8V24ZM34 0H2C0.9 0 0 0.9 0 2V34C0 35.1 0.9 36 2 36H34C35.1 36 36 35.1 36 34V2C36 0.9 35.1 0 34 0ZM32 32H4V4H32V32Z" fill="white"/>
      </svg>`,
      active: false,
      href: null,
      onPress: (event) => this._onPress(event),
    });
  }

  private _onPress = async (event): Promise<void> => {
    urlState.navigate({segment: 'presentations', segmentId: null, route: null});
  };

  protected _dispose() {
    super._dispose();
  }
}
