/**
 *
 *
 */

import * as React from 'react';
import cn from 'classnames';
import { WpLoadingIcon } from 'bi-internal/ui';
// import { User } from '../../services/adm/UsersService';
import { PresentationDetailsView } from './PresentationDetailsView';
import {IPresentationModel, IRawPresentation, ISlideModel} from './models';
import { IUsersForPresentationModel, UsersForPresentationService } from 'bi-internal/services';
import {
  PresentationModel,
  PresentationsListService,
  withPresentationsListService,
} from 'bi-internal/services';
import { DlgShareWithUser } from 'bi-internal/ui';
import { lang, search } from 'bi-internal/utils';
import './PresentationsPage.scss';
import { PresentationElement } from './PresentationElement';
import range from 'lodash/range';
import { ScheduleDlg } from './ScheduleDlg';
import { AlertsVC } from 'bi-internal/ui';
import { urlState, AuthenticationService } from 'bi-internal/core';
import { BIIcon } from 'bi-internal/ui';
// import {IMainToolbarVM} from '../../view-controllers/panels/MainToolbarVC';
// import {DsStateService} from '../../services/ds/DsStateService';
// import {shell} from '../../views/Shell';
// import {$eid} from '../../libs/imdas/list';
// import {SlidesListService} from '../../services/bm/SlidesListService';
// import {getBookmarksManager} from './_bookmarks-manager';
import { DatasetsListService, IDatasetsListModel } from 'bi-internal/services';
import RowSimple from "./RowSimple/RowSimple";
import IconCreate from "./IconCreate/IconCreate";
import Pagination from "../news/Pagination/Pagination";
import ComponentTable from "../news/ComponentTable/ComponentTable";

const ONE_HOUR = 3600000;

interface IPresentationsListViewProps {
  presentations: IPresentationModel[];
  onSharePress: (presentation: IPresentationModel) => void;
  onUnsharePress: (presentation: IPresentationModel, user: User) => void;
  onSelectPresentation: (presentation: IPresentationModel) => void;
  setPresentationEditable: (presentation: IPresentationModel | null) => void;
  style?: any;
  searchTerm: string;
  currentEditingPresentation: IPresentationModel | null;
  pendingPresentation: IPresentationModel | null;
}

export class PresentationsListView extends React.Component<IPresentationsListViewProps> {
  public state: {
    attendingToRemove: IPresentationModel | null;
    page: number;
    newPresentations: number[];
  } = {
    attendingToRemove: null,
    page: 0,
    newPresentations: []
  };

  public constructor(props) {
    super(props);
  }

  _hasNewPresentations () {
    const { presentations } = this.props;
    if (!(presentations && presentations.length > 0)) return null;
    const dateExpired = new Date(localStorage.getItem(`hasNewPresentations`)).getTime();
    const newPresentations = [];
    presentations.forEach((p) => {
      if (dateExpired <= p.created.getTime() && p.created.getTime() <= (dateExpired + ONE_HOUR)) newPresentations.push(p.id);
    });
    if (newPresentations.length === 0) localStorage.removeItem(`hasNewPresentations`);
    this.setState({newPresentations});
  }

  public componentDidMount() {
    this._hasNewPresentations();
  }

  public componentDidUpdate(prevProps: Readonly<IPresentationsListViewProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const {currentEditingPresentation} = this.props;
    if (currentEditingPresentation && currentEditingPresentation !== prevProps.currentEditingPresentation) {
      let presentations = this._getPresentationsToDisplay();
      const idx = presentations.indexOf(currentEditingPresentation);
      if (idx !== -1) {
        const page = Math.floor(idx / 5);
        if (page !== this.state.page) {
          this.setState({page});
        }
      }
    }
  }

  private _onEditPress = (presentation: IPresentationModel, newTitle: string, newDescription: string) => {
    const {currentEditingPresentation, } = this.props;
    if (currentEditingPresentation === presentation) {
      withPresentationsListService(async (pls: PresentationsListService) => {
        const title = (newTitle != null) ? newTitle : presentation.title;
        const description = (newDescription != null) ? newDescription : presentation.description;
        try {
          if (presentation.id !== null) {
            await pls.updatePresentationTitle(presentation.id, title, description);
          } else {
            const newP = await pls.createPresentation(title, description);
            if (new Date(localStorage.getItem(`hasNewPresentations`)).getTime() + ONE_HOUR < newP.created.getTime()) localStorage.setItem(`hasNewPresentations`, newP.created.toString());
            this._hasNewPresentations();
          }
          AlertsVC.getInstance().pushSuccessAlert('Изменения успешно сохранены');

          this.setState({title: null, description: null});
          // this.setState({currentEditingPresentation: null});
          this.props.setPresentationEditable(null);
        } catch (err) {
          AlertsVC.getInstance().pushDangerAlert('Сохранение не удалось');
        }
      });

    } else {
      // this.setState({ currentEditingPresentation: presentation });
      this.props.setPresentationEditable(presentation);
    }
  };

  private _onRemovePress = (attendingToRemove: IPresentationModel) => {
    if (this.state.attendingToRemove === attendingToRemove) {
      this.setState({attendingToRemove: null});
    } else {
      this.setState({attendingToRemove});
    }
  };

  private _onCancelRemove = () => {
    this.setState({
      attendingToRemove: null,
    });
  };

  private _removePresentation = async (p: IPresentationModel, presentations: any, page: number) => {
    if (p.id === null) {                                                                            // новая презентация
      this.props.setPresentationEditable(null);
      return;
    }

    const pls = PresentationsListService.getInstance();
    await pls.whenReady();
    try {
      await pls.removePresentation(p.id);
      AlertsVC.getInstance().pushSuccessAlert('Шаблон успешно удален');
    } catch (e) {
      AlertsVC.getInstance().pushDangerAlert('Удаление не удалось');
    }
  };

  private _getPresentationsToDisplay() {
    let {presentations, searchTerm, pendingPresentation} = this.props;
    presentations = presentations.slice().sort((a: IPresentationModel, b: IPresentationModel) => b.id - a.id);
    presentations = searchTerm ? presentations.filter(p => search(p.title, searchTerm)) : presentations;

    if (pendingPresentation) {
      presentations.unshift(pendingPresentation);
    }
    return presentations;
  }

  public render() {
    let {currentEditingPresentation, pendingPresentation} = this.props;
    let {attendingToRemove, page, newPresentations} = this.state;

    let presentations = this._getPresentationsToDisplay();

    const n = presentations.length;
    const nPages = n > 0 ? Math.floor(n / 5) + (n % 5 ? 1 : 0) : 1;
    if (nPages <= page) page = nPages - 1;
    presentations = presentations.slice(page * 5, page * 5 + 5);

    let pagesSet = {[0]: true, [nPages - 1]: true};
    range(page - 2, page + 3).filter(p => 0 <= p && p < nPages).forEach(pid => pagesSet[pid] = true);
    let validPages = Object.keys(pagesSet).filter(pid => pagesSet[pid]).map(pid => +pid).sort((a, b) => a - b);
    let pages = [];
    validPages.forEach((p, i) => {pages.push(p); if (validPages[i + 1] && validPages[i + 1] - validPages[i] !== 1) pages.push(null); });

    return (
      <ComponentTable
        classNameArticle={`PresentationsPage__Body`}
        classNameTable={`PresentationsListView folders`}
      >
        {<tr>
          <th></th>
          <th>Номер</th>
          <th>Название шаблона</th>
          <th>Описание шаблона</th>
          <th>Автор</th>
          <th>Дата создания</th>
          <th>Последняя публикация</th>
          <th></th>
        </tr>}
        {!!presentations.length && presentations.map((presentation, idx) => (
          <tr key={presentation.id}
              className={cn("folder PresentationsListView__Item",{PresentationsListView__NewItem: newPresentations.includes(presentation.id)})}
              data-bind="contextMenu: $parent.presentationContextMenu, event:{dblclick:function(){$parent.handleBookmarksFolderActivate($data)}}">
            <PresentationElement idx={idx + (page * 5)}
                                 key={idx + (page * 5)}
                                 presentation={presentation}
                                 isEditing={currentEditingPresentation === presentation}
                                 onEditClick={(title, description) => this._onEditPress(presentation, title, description)}
                                 onRemovePress={() => this._onRemovePress(presentation)}
                                 onSharePress={() => this.props.onSharePress(presentation)}
                                 onUnsharePress={this.props.onUnsharePress}
                                 isAttendingToRemove={attendingToRemove === presentation}
                                 onMouseLeave={this._onCancelRemove}
                                 onRemoveCancelPress={this._onCancelRemove}
                                 onRemoveApprovePress={() => this._removePresentation(presentation, presentations, this.state.page)}
                                 onSelectPresentation={() => this.props.onSelectPresentation(presentation)}
            />
          </tr>))}
        {!!this.props.presentations.length && !presentations.length &&
        <RowSimple key={'notFound'}
                   classNameTR={`folder PresentationsListView__Item`}
                   dataBind={`contextMenu: $parent.presentationContextMenu, event:{dblclick:function(){$parent.handleBookmarksFolderActivate($data)}}`}
        >
          {`Шаблонов с таким названием не найдено.`}
        </RowSimple>
        }

        {!this.props.presentations.length && !pendingPresentation &&
        <RowSimple style={{border: 'none'}}
                   classNameTR={"folder PresentationsListView__Item"}
                   classNameTD="PresentationsListView__Empty"
        >
          {<>
            Еще не создано ни одного шаблона.<br/> Нажмите на кнопку “Создать шаблон” для добавления нового
            шаблона.<br/>
            <IconCreate/>
          </>}
        </RowSimple>
        }
        <Pagination
          pages={pages}
          activePage={page}
          onPrevClick={() => this.setState({page: page > 0 ? page - 1 : page})}
          onPageClick={(pid) => this.setState({ page: pid })}
          onNextClick={() => this.setState({page: page < range(nPages).length - 1 ? page + 1 : page})}
          className={`PresentationsListView__Footer`}
          classNamePrev={cn('PresentationsListView__FooterArrow', {visible: page > 0})}
          classNameNext={cn('PresentationsListView__FooterArrow', {visible: page < nPages - 1})}
          style={{fontSize: `1.38rem`, lineHeight: `1.62rem`}}
          classNameFirstLastPage={cn({disabled: page > 0})}
          onFirstPageClick={() => this.setState({ page: 0 })}
          onLastPageClick={() => this.setState({ page: nPages - 1 })}
        />
      </ComponentTable>);
  }
}


interface IPresentationsPageProps {
  presentations: IPresentationModel[];
  loading: boolean;
  error: string;
  activePresentation: IPresentationModel;
  selectPresentation: (presentation: IPresentationModel) => void;
  onUnsharePress: (presentation: IPresentationModel, user: User) => void;
}


export default class PresentationsPage extends React.Component<IPresentationsPageProps> {
  public props: IPresentationsPageProps;
  public state: {
    shareDialogModel: IUsersForPresentationModel;
    usersForPresentationService: UsersForPresentationService;
    searchTerm: string;
    schedulerVisible: boolean;
    thumbnailContent: string;
    isTrendsButtonVisible: boolean;
    currentEditingPresentation: IPresentationModel | null;
    pendingPresentation: IPresentationModel | null,
  };

  public constructor(props) {
    super(props);
    this.state = {
      shareDialogModel: null,
      usersForPresentationService: null,
      searchTerm: '',
      schedulerVisible: false,
      thumbnailContent: null,
      isTrendsButtonVisible: false,
      currentEditingPresentation: null,
      pendingPresentation: null,
    };
    this._loadThumbnail();
  }

  public componentDidMount(): void {
    DatasetsListService.subscribeUpdatesAndNotify(this._onDatasetsListUpdated);
  }

  public componentWillUnmount(): void {
    DatasetsListService.unsubscribe(this._onDatasetsListUpdated);
  }

  private _onDatasetsListUpdated = (dsModel: IDatasetsListModel) => {
    if (dsModel.error || dsModel.loading) return;
    /* Подумать над добавлением нового конструктора ds_48 */
    this.setState({isTrendsButtonVisible: !!dsModel.datasets.find(ds => ds.schema_name === 'ds_44')});
  };

  private _onClickLogout = () => {
    AuthenticationService.signOut();
    window.location.hash = '#';
  };


  private async _createTemplate(presentations: IPresentationModel[]): Promise<any> {
    const pendingPresentation = {
      id: null,
      topic_type: 'presentation',
      title: '',
      description: '',
      parent_id: null,
      user_id: 0,
      config: {},
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      _is_mine: true,
      users: [],
      filename: null,
      isMine: true,
    };
    this.setState({pendingPresentation, currentEditingPresentation: pendingPresentation});
  }

  private _onClickHome = () => {
    window.location.hash = '#/ds/';
  };

  private async _loadThumbnail() {
    // const schemaName = urlState.getModel().dataset;
    // const svgUrl = AppConfig.fixRequestUrl(`/srv/resources/${schemaName}/thumbnail.svg`);
    const svgUrl = 'assets/images/rzd2/thumbnail.svg';
    const request = await fetch(svgUrl, {credentials: 'same-origin'});
    const thumbnailContent = await request.text();
    this.setState({thumbnailContent});
  }

  private _renderLoading() {
    return (
      <article className="PresentationsPage view presentations loading" style={{minHeight: '300px'}}>
        <span className="magic-center" style={{width: '200px'}}>
          <WpLoadingIcon/>
        </span>
      </article>);
  }

  private _renderError(error: string) {
    return (
      <article className="PresentationsPage view presentations error-background" style={{minHeight: '300px'}}>
        <div className="magic-center" style={{width: '95%', maxWidth: '400px'}}>
          <BIIcon icon="bug" className="black"
                  style={{display: 'inline-block', width: '64px', height: '64px', float: 'left', margin: '20px'}}/>
          <h2 style={{fontWeight: 'normal', fontSize: '24px', lineHeight: '64px'}}>{lang('error')}</h2>
          <div style={{clear: 'both'}}></div>
          <span style={{width: '100%', display: 'inline-block', textAlign: 'center'}}>{error}</span>
        </div>
      </article>);
  }

  private _renderNoPresentations() {
    return (
      <article className="PresentationsPage empty view presentations" style={{minHeight: 300, marginTop: 100}}>
        <div className="magic-center"
             style={{fontSize: '36px', color: '#666666', width: '100%', maxWidth: '500px', top: '128px'}}>
          <BIIcon icon="empty" style={{width: '100%', height: 128, textAlign: 'center'}}/>
          <span dangerouslySetInnerHTML={{__html: lang('bm-presentations-empty')}}/>
        </div>
      </article>);
  }

  private _activePresentationCancelled = () => {
    this.props.selectPresentation(null);
  };

  private _usersForPresentationSubscription: IDisposable = null;

  private _onSharePress = (presentation: IPresentationModel) => {

    const newUsersForPresentationService = presentation ? UsersForPresentationService.createInstance(presentation) : null;

    if (this._usersForPresentationSubscription) {
      this._usersForPresentationSubscription.dispose();
      this._usersForPresentationSubscription = null;
    }

    if (this.state.usersForPresentationService) {
      this.state.usersForPresentationService.release();
    }

    if (newUsersForPresentationService) {
      this._usersForPresentationSubscription = newUsersForPresentationService.subscribeUpdatesAndNotify((model) => {
        this.setState({
          ...this.state,
          usersForPresentationService: newUsersForPresentationService,
          shareDialogModel: model,
        });
      });
    } else {
      this.setState({
        ...this.state,
        usersForPresentationService: null,
        shareDialogModel: null,
      });
    }
  };

  private _share = async (user: User): Promise<any> => {
    const presentation = this.state.shareDialogModel.presentation;
    const svc: UsersForPresentationService = UsersForPresentationService.createInstance(presentation);
    try {
      await svc.whenReady();
      await svc.shareWithUser(user);
    } finally {
      svc.release();
    }
  };

  private _removeSlide = async (slide: ISlideModel): Promise<any> => {
    let svc: PresentationsListService = PresentationsListService.getInstance().retain();
    try {
      await svc.whenReady();
      await svc.removeSlide(slide);
    } finally {
      svc.release();
    }
  };

  private _onSearchTermChanged = (searchTerm: string) => this.setState({searchTerm});

  // private _onSearchToggleExpanded = (searchExpanded: boolean) => this.setState({searchExpanded});

  private _onClickTrends = () => {
    urlState.navigate({segment: 'ds', segmentId: 'ds_48', route: '#dashboards', dboard: 1 });
  };

  private _setPresentationEditable = (presentation: IPresentationModel | null) => {
    this.setState({currentEditingPresentation: presentation});
    if (presentation == null) {
      // если обнуляется текущая активная презентация, то обнуляем и "несозданную" - это очень скользкий момент, и требует дальнейших размышлений
      this.setState({pendingPresentation: null});
    }
  };

  public render() {
    const { loading, error, presentations, activePresentation } = this.props;
    const { shareDialogModel, searchTerm, schedulerVisible, thumbnailContent, isTrendsButtonVisible } = this.state;
    const { currentEditingPresentation, pendingPresentation } = this.state;

    if (error) {
      return this._renderError(error);
    }
    if (loading) {
      return this._renderLoading();
    }
    // if (presentations.length === 0) {
    //   return this._renderNoPresentations();
    // }

    return (
      <article className="PresentationsPage view presentations">
        <header className="Root__Header">
          <h1 style={{justifyContent: 'flex-start', paddingLeft: 15}}>
            <a href={urlState.buildUrl({segment: 'ds', segmentId: 'ds_7', route: '#dashboards', dboard: 1})}
               className="Root__HeaderThumbnail "
               dangerouslySetInnerHTML={{__html: thumbnailContent}}/>
          </h1>

          <div className="Root__Icons">

            { !!isTrendsButtonVisible &&
            <span className="DashboardsHeader__TrendsLink" title="Перейти к созданию отчета" onClick={this._onClickTrends}>
              <svg style={{width: '2rem', height: '2.1rem'}} viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="6" width="4" height="17" rx="1" fill="white"/>
                <rect x="19" y="10" width="4" height="13" rx="1" fill="white"/>
                <rect x="12" y="1" width="4" height="22" rx="1" fill="white"/>
                <line x1="0.5" y1="-2.18557e-08" x2="0.500001" y2="26" stroke="white"/>
                <line x1="26" y1="26.5" y2="26.5" stroke="white"/>
              </svg>
            </span>}

            <span className="PresentationsPage__IconHome" onClick={this._onClickHome}>
              <svg viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.6003 15.1169C32.1544 14.4899 32.1544 13.5146 31.4618 12.9573L17.1947 0.417978C16.5714 -0.139326 15.5325 -0.139326 14.8399 0.417978L0.503559 13.6539C-0.119761 14.2112 -0.189019 15.1865 0.434301 15.8135L0.78059 16.1618C1.40391 16.7888 2.37352 16.8584 2.92758 16.3011L3.96645 15.3258V29.4674C3.96645 30.3034 4.65903 31 5.55938 31H11.1693C12.0004 31 12.6929 30.3034 12.6929 29.4674V19.5753H19.8265V29.4674C19.8265 30.3034 20.4498 31 21.2809 31H27.1678C27.9989 31 28.7608 30.3034 28.7608 29.3978V15.4652C28.7608 15.4652 29.0378 15.7438 29.4533 16.0225C29.7996 16.3708 30.5615 16.0921 31.1848 15.4652L31.6003 15.1169Z" fill="white"/>
              </svg>
            </span>
            {/*
            <span className="PresentationsPage__IconLogout" onClick={this._onClickLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                   shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"
                   viewBox="0 0 10000 10000">
                <path fill="white" fillRule="nonzero"
                      d="M4746.8 9116.14l0 563.18 1754.2 0c74.01,0 146.65,-29.9 198.66,-82.59 52.64,-52.32 82.47,-125.01 82.47,-199.15l0 -3245.7 -562.87 0 0 2964.26 -1472.46 0zm2035.33 -5686.19l0 -2827.55c0,-74.19 -29.83,-146.83 -82.47,-199.28 -52.01,-52.38 -124.65,-82.59 -198.66,-82.59l-1754.2 0 0 563.26 1472.46 0 0 2546.16 562.87 0zm3207.22 1376.34l-2950.35 -2190.71 0 1136.49 -2292.2 0 0 2094.82 2292.2 0 0 1136.21 2950.35 -2176.81zm-9648.96 -4470.88c-186.87,16.42 -329.74,172.42 -329.74,359.83l0 8270.64c0,175.92 125.25,325.02 298.22,356l3774.69 672.39c105.52,18.94 213.57,-9.65 295.45,-78.76 82.22,-68.86 129.33,-169.9 129.33,-276.82l0 -9277.23c0,-102 -41.97,-197.7 -116.99,-266.45 -75.34,-68.92 -174.52,-102.6 -276.27,-93.54l-3774.69 333.94z"/>
              </svg>
            </span>
            */}
          </div>
        </header>

        <header className="PresentationsPage__Header">
          <div className="PresentationsPage__HeaderWrapper">
            <h1 className="PresentationsPage__HeaderTitle">Список шаблонов отчетов</h1>
            <button className="PresentationsPage__NewButton btn btn-primary" onClick={() => this._createTemplate(presentations)}>Создать шаблон</button>
          </div>
          <div className="PresentationsPage__HeaderPanel">
            <div className="PresentationsPage__SchedulerButton">
              <p className="PresentationsPage__SchedulerIcon__Wrap" title = "Создать новое расписание">
                <svg  onClick={() => this.setState({schedulerVisible: !this.state.schedulerVisible})}
                      className="PresentationsPage__SchedulerIcon" width="25" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 0C5.81855 0 0 5.81855 0 13C0 20.1815 5.81855 26 13 26C20.1815 26 26 20.1815 26 13C26 5.81855 20.1815 0 13 0ZM13 23.4839C7.20766 23.4839 2.51613 18.7923 2.51613 13C2.51613 7.20766 7.20766 2.51613 13 2.51613C18.7923 2.51613 23.4839 7.20766 23.4839 13C23.4839 18.7923 18.7923 23.4839 13 23.4839ZM16.2395 18.0113L11.7891 14.777C11.6266 14.6565 11.5323 14.4677 11.5323 14.2685V5.66129C11.5323 5.31532 11.8153 5.03226 12.1613 5.03226H13.8387C14.1847 5.03226 14.4677 5.31532 14.4677 5.66129V13.0891L17.9694 15.6367C18.2524 15.8411 18.3101 16.2343 18.1056 16.5173L17.1202 17.875C16.9157 18.1528 16.5226 18.2157 16.2395 18.0113Z" fill="white"/>
                </svg>
              </p>
              {schedulerVisible &&
              <ScheduleDlg onClose={() => this.setState({schedulerVisible: false})}/>}
            </div>
            <input className="PresentationsPage__SearchInput" type="text" value={searchTerm} onChange={(event) => this._onSearchTermChanged(event.target.value)}/>
            <svg style={{width: '1.08rem', height: '1.08rem'}} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={'findItBtn'}>
              <path d="M13.7402 13.74C13.5671 13.9133 13.3597 14 13.1182 14C12.8766 14 12.6693 13.9133 12.4961 13.74L9.78906 11.0303C8.69531 11.8423 7.47396 12.2483 6.125 12.2483C5.29557 12.2483 4.5026 12.0863 3.74609 11.7625C2.98958 11.4386 2.33789 11.0029 1.79102 10.4555C1.24414 9.90811 0.808919 9.25806 0.485352 8.50538C0.161784 7.75269 0 6.95894 0 6.12414C0 5.28935 0.161784 4.49332 0.485352 3.73607C0.808919 2.97882 1.24414 2.32877 1.79102 1.78592C2.33789 1.24308 2.98958 0.80971 3.74609 0.485826C4.5026 0.161942 5.29557 0 6.125 0C6.95443 0 7.7474 0.161942 8.50391 0.485826C9.26042 0.80971 9.91211 1.24308 10.459 1.78592C11.0059 2.32877 11.4411 2.97882 11.7646 3.73607C12.0882 4.49332 12.25 5.28706 12.25 6.1173C12.25 7.4767 11.8444 8.69925 11.0332 9.78495L13.7402 12.4946C13.9134 12.668 14 12.8755 14 13.1173C14 13.3591 13.9134 13.5666 13.7402 13.74ZM6.125 1.75171C5.33203 1.75171 4.60059 1.94558 3.93066 2.33333C3.26074 2.72108 2.72982 3.25253 2.33789 3.92766C1.94596 4.6028 1.75 5.33496 1.75 6.12414C1.75 6.91333 1.94596 7.64549 2.33789 8.32063C2.72982 8.99576 3.26074 9.52721 3.93066 9.91496C4.60059 10.3027 5.33203 10.4966 6.125 10.4966C6.91797 10.4966 7.64941 10.3027 8.31934 9.91496C8.98926 9.52721 9.52018 8.99576 9.91211 8.32063C10.304 7.64549 10.5 6.91333 10.5 6.12414C10.5 5.33496 10.304 4.6028 9.91211 3.92766C9.52018 3.25253 8.98926 2.72108 8.31934 2.33333C7.64941 1.94558 6.91797 1.75171 6.125 1.75171Z" fill="#5C6F82"/>
            </svg>
          </div>
        </header>
        <PresentationsListView presentations={presentations}
                               onSharePress={this._onSharePress}
                               onUnsharePress={this.props.onUnsharePress}
                               searchTerm={searchTerm}
                               onSelectPresentation={this.props.selectPresentation}
                               setPresentationEditable={this._setPresentationEditable}
                               currentEditingPresentation={currentEditingPresentation}
                               pendingPresentation={pendingPresentation} />

        {shareDialogModel &&
        <div onClick={() => this._onSharePress(null)}
             style={{
               position: 'fixed',
               zIndex: 10,
               left: 0,
               top: 0,
               width: '100%',
               height: '100%',
               backgroundColor: 'rgba(0,0,0,0.3)',
             }}
        />}

        {shareDialogModel &&
        <DlgShareWithUser loading={!!shareDialogModel.loading}
                          noUsersError={lang('bm-no-users-available')}
                          error={shareDialogModel.error}
                          users={shareDialogModel.users}
                          selectedUsers={shareDialogModel.presentation ? shareDialogModel.presentation.users() : []}
                          title={shareDialogModel.presentation ? shareDialogModel.presentation.title : ''}
                          share={this._share}
                          onClosePress={() => this._onSharePress(null)}/>}

        {activePresentation &&
        <PresentationDetailsView presentation={activePresentation}
                                 onCancel={this._activePresentationCancelled}
                                 onRemoveSlide={this._removeSlide}/>}
      </article>);
  }
}
