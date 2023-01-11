import * as React from "react";
import {IRawNewsItem} from "../../../repositories/vcp/news";
import NewsService from "../../../services/vcp/NewsService";
import {AuthenticationService} from "bi-internal/core";
import {IRawNewsViewsItem} from "../../../repositories/vcp/newsViews";
import NewsViewsService from "../../../services/vcp/NewsViewsService";
import PageError from "../PageError/PageError";
import PageLoading from "../PageLoading/PageLoading";
import ComponentAccess from "./ComponentAccess";

interface IDisplayNewsModel {
  minimalMode?: boolean | null;
  onClickClose?: () => void;
  className?: string;
}

export default class ComponentAccessCV extends React.Component<IDisplayNewsModel> {
  public state: {
    loading: boolean;
    error: string;
    news: IRawNewsItem[];
    newsViews: IRawNewsViewsItem[];
    lastPage: number;
    currentEditingNews: IRawNewsItem | null;
    pendingNewsItem: IRawNewsItem | null;
    thumbnailContent: string;
    searchTerm: string;
  } = {
    loading: true,
    error: '',
    news: [],
    newsViews: [],
    lastPage: 0,
    currentEditingNews: null,
    pendingNewsItem: null,
    thumbnailContent: null,
    searchTerm: null,
  };

  constructor(props) {
    super(props);
    this._loadThumbnail();
  }

  private _createNews = async (): Promise<any> => {
    const pendingNewsItem = {
      user_id: AuthenticationService.getModel().userId,
      title: '',
      description: null,
      config: {pendingDescription: '',updated: new Date().toISOString()},
    };
    this.setState({pendingNewsItem, currentEditingNews: pendingNewsItem});
  }

  private _onClickHome = () => {
    window.location.hash = '#/ds/';
  };

  private async _loadThumbnail() {
    const svgUrl = 'assets/images/rzd2/thumbnail.svg';
    const request = await fetch(svgUrl, {credentials: 'same-origin'});
    const thumbnailContent = await request.text();
    this.setState({thumbnailContent});
  }

  private _onSearchTermChanged = (searchTerm: string) => this.setState({searchTerm});

  private _setNewsItemEditable = (newsItem: IRawNewsItem | null) => {
    this.setState({currentEditingNews: newsItem});
    if (newsItem == null) {
      // если обнуляется текущая активная презентация, то обнуляем и "несозданную" - это очень скользкий момент, и требует дальнейших размышлений
      this.setState({pendingNewsItem: null});
    }
  }

  public componentDidMount() {
    NewsService.getInstance().subscribeUpdatesAndNotify(this._onServicesUpdated);
    NewsViewsService.getInstance().subscribeUpdatesAndNotify(this._onServicesUpdated);
  }

  public componentWillUnmount() {
    NewsService.getInstance().unsubscribe(this._onServicesUpdated);
    NewsViewsService.getInstance().unsubscribe(this._onServicesUpdated);
  }

  private _onServicesUpdated = () => {
    const newsModel = NewsService.getInstance().getModel();
    const newsViewsModel = NewsViewsService.getInstance().getModel();
    this.setState({
      error: newsModel.error || newsViewsModel.error,
      loading: newsModel.loading || newsViewsModel.loading,
      news: newsModel.entities.sort((prev: IRawNewsItem, next: IRawNewsItem) => new Date(next.config.updated).getTime() - new Date(prev.config.updated).getTime()),
      newsViews: newsViewsModel.entities,
    });
  }

  public render() {
    const {minimalMode, onClickClose, className,} = this.props;
    let {
      loading, error, news, newsViews, lastPage, searchTerm, thumbnailContent,
      currentEditingNews, pendingNewsItem,
    } = this.state;

    if (error) return <PageError error={error}/>;
    if (loading) return <PageLoading/>;

    if (pendingNewsItem) {
      news = [pendingNewsItem, ...news];
    }
    return (
      <ComponentAccess news={news}
                       views={newsViews}
                       lastPage={lastPage}
                       currentEditingNews={currentEditingNews}
                       pendingNewsItem={pendingNewsItem}
                       thumbnailContent={thumbnailContent}
                       searchTerm={searchTerm}
                       onClickHome={this._onClickHome}
                       createNews={this._createNews}
                       onSearchTermChanged={this._onSearchTermChanged}
                       setNewsItemEditable={this._setNewsItemEditable}
                       minimalMode={minimalMode}
                       onClickClose={onClickClose}
                       className={className}

      />
    );
  }
}
