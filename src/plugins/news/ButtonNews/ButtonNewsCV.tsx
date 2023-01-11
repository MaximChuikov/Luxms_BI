import * as React from "react";
import {IRawNewsItem} from "../../../repositories/vcp/news";
import {IRawNewsViewsItem} from "../../../repositories/vcp/newsViews";
import NewsService from "../../../services/vcp/NewsService";
import NewsViewsService from "../../../services/vcp/NewsViewsService";
import {getUnreadNews} from "bi-internal/utils";
import ButtonNews from "./ButtonNews";
import IconLetterWithCounter from "../IconLetterWithCounter/IconLetterWithCounter";

interface IPropsButtonNews {
  onClickButton: (event: any) => void;
}

export default class ButtonNewsCV extends React.Component <IPropsButtonNews> {
  public state: {
    loading: boolean; error: string; news: IRawNewsItem[]; newsViews: IRawNewsViewsItem[];
    className: string;
  } = {loading: true, error: '', news: [], newsViews: [], className: `LastIcon`};

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
      news: newsModel.entities,
      newsViews: newsViewsModel.entities,
    });
  }

  protected _makeData() {
    return getUnreadNews(this.state.news, this.state.newsViews).countNews;
  }

  public render() {
    const {onClickButton} = this.props;
    const {error, loading, className} = this.state;
    const unread: number = this._makeData();

    if (error || loading) return (
      <ButtonNews
        className={className}
      >
        <IconLetterWithCounter counter={0}/>
      </ButtonNews>
    );

    return <ButtonNews
      onClickButton={onClickButton}
      className={className}
    >
      <IconLetterWithCounter counter={unread}/>
    </ButtonNews>;
  }
}
