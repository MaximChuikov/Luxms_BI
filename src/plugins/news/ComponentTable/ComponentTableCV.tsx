import {IRawNewsItem} from "../../../repositories/vcp/news";
import {IRawNewsViewsItem} from "../../../repositories/vcp/newsViews";
import * as React from "react";
import NewsService from "../../../services/vcp/NewsService";
import {AlertsVC} from "bi-internal/ui";
import NewsViewsService from "../../../services/vcp/NewsViewsService";
import {getUnreadNews, search} from "bi-internal/utils";
import range from 'lodash/range';
import cn from 'classnames';
import IconLetterClosed from "../IconLetterClosed/IconLetterClosed";
import IconLetterOpened from "../IconLetterOpened/IconLetterOpened";
import Pagination from "../Pagination/Pagination";
import ComponentTable from "./ComponentTable";
import RowCV from "../Row/RowCV";

const NUMBER_OF_ROW = 5;

interface IComponentTableCVProps {
  news: IRawNewsItem[],
  setNewsItemEditable: (newsItem: IRawNewsItem | null) => void;
  style?: any;
  searchTerm: string;
  lastPage: number;
  currentEditingNews: IRawNewsItem | null;
  minimalMode?: boolean;
  className?: string;
  views?: IRawNewsViewsItem[];
}


export default class ComponentTableCV extends React.Component<IComponentTableCVProps> {
  public state: {
    attendingToRemove: IRawNewsItem | null;
    attendingToPublish: IRawNewsItem | null;
    textPublishDialog: string;
    textRemoveDialog: string;
    page: number;
    newNewsToday: number [];
  } = {
    attendingToRemove: null,
    attendingToPublish: null,
    page: 0,
    textPublishDialog: ``,
    textRemoveDialog: `Вы точно хотите удалить новость?`,
    newNewsToday: [],
  };

  constructor(props) {
    super(props);
    if (this.props.news && this.props.news.length > 0) {
      const today = (new Date()).getTime();
      this.props.news.forEach((n: IRawNewsItem) => {
        // const newsUpdate = (new Date(n.updated)).getTime();
        // if (newsUpdate < today) this.state.newNewsToday.push(n.id);
        this.state.newNewsToday.push(n.id);
      })
    }
  }

  public componentDidUpdate(prevProps: Readonly<IComponentTableCVProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.currentEditingNews !== prevProps.currentEditingNews) {
      // поменялась текущая редактируемая новость - надо активировать страницу с ней
      const idx = this.props.news.indexOf(this.props.currentEditingNews);
      if (idx !== -1) {
        const page = Math.floor(idx / NUMBER_OF_ROW);
        if (this.state.page !== page) {
          this.setState({page});
        }
      }
    }
  }

  public UNSAFE_componentWillReceiveProps(props: Readonly<any>, context: any): void {
    if (this.props.lastPage !== props.lastPage) {
      if (props.lastPage) {
        this.setState({page: props.lastPage});
      }
    }
    if (this.props.news.length !== props.news.length) {
      const {news} = props;
      const {newNewsToday} = this.state;
      this.setState({newNewsToday: news.map((n) => newNewsToday.includes(n.id) && !!n.id ? n.id : null)});
    }
  }

  private _onEditPress = async (itemNews: IRawNewsItem, newDate: Date , newDescription: string) => {
    this.setState({attendingToRemove: null, attendingToPublish: null});
    if (this.props.currentEditingNews !== itemNews) {
      // просто активируем редактирование
      this.props.setNewsItemEditable(itemNews);
      return;
    }

    try {
      let updated = (newDate != null) ? newDate.toISOString() : (itemNews.config.pendingUpdated ?? itemNews.config.updated);
      let description = (newDescription != null) ? newDescription : (itemNews.config.pendingDescription ?? itemNews.description);

      let newItem = this.props.minimalMode
        ? {
          config: {
            updated,
          },
          description,
        }
        : {
          config: {
            pendingUpdated: updated,
            pendingDescription: description,
          },
        };

      const pls = NewsService.getInstance();
      newItem.config = {...itemNews.config, ...newItem.config};
      if (itemNews.id) {
        await pls.updateOne(itemNews.id, newItem);
      } else {
        await pls.create({...itemNews, ...newItem});
      }
      AlertsVC.getInstance().pushSuccessAlert('Изменения успешно сохранены');
      this.props.setNewsItemEditable(null);
    } catch (err) {
      AlertsVC.getInstance().pushDangerAlert('Сохранение не удалось');
    }
  };

  private _onRemovePress = (attendingToRemove: IRawNewsItem) => {
    if (this.state.attendingToRemove === attendingToRemove) {
      this.setState({ attendingToRemove: null });
    } else {
      this.setState({ attendingToRemove, attendingToPublish: null });
    }
  };

  private _onCancelRemove = () => {
    this.setState({
      attendingToRemove: null,
    });
  };

  private _removePresentation = async (p: IRawNewsItem, presentations: any, page: number) => {
    if (p.id == null) {
      // эта новость еще не создана
      this.props.setNewsItemEditable(null);
      AlertsVC.getInstance().pushSuccessAlert('Изменения успешно сохранены');
      return;
    }

    const pls = NewsService.getInstance();
    await pls.whenReady();
    try {
      await pls.remove(p.id);
      AlertsVC.getInstance().pushSuccessAlert('Изменения успешно сохранены');
    } catch (e) {
      AlertsVC.getInstance().pushDangerAlert('Сохранение не удалось');
    }
  };

  private _onPublishPress = (attendingToPublish: IRawNewsItem) => {
    const {description, config} = attendingToPublish;
    const {updated, pendingUpdated, pendingDescription} = config;
    // esix: новость опубликована, если ее description не пустой, и при этом совпадает с pendingDescription
    // если pendingDescription == null - считаем опубликованной, для совместимости
    // также добавил условие для даты
    const isPublished = description != null && (pendingDescription == null || description === pendingDescription)
      && (updated === pendingUpdated);

    if (!isPublished) {
      this.setState({ textPublishDialog: `Вы точно хотите опубликовать новость?` });
    } else {
      this.setState({ textPublishDialog: `Вы точно хотите снять новость с публикации?` });
    }
    if (this.state.attendingToPublish === attendingToPublish) {
      this.setState({ attendingToPublish: null });
    } else {
      this.setState({ attendingToPublish, attendingToRemove: null });
    }
  };

  private _onCancelPublish = () => {
    this.setState({
      attendingToPublish: null,
    });
  };

  private _publishNews = async (p: IRawNewsItem) => {
    const pls = NewsService.getInstance();
    try {
      const { description, config} = p;
      const {updated, pendingUpdated, pendingDescription} = config;

      // esix: новость опубликована, если ее description не пустой, и при этом совпадает с pendingDescription
      // если pendingDescription == null - считаем опубликованной, для совместимости
      // также добавил условие для даты
      const isPublished = description != null && (pendingDescription == null || description === pendingDescription)
        && (updated === pendingUpdated);

      if (isPublished) {
        // снимаем с публикации - очищаем description (pendingDescription не трогаем)
        await pls.updateOne(p.id, { config: {updated: pendingUpdated, pendingUpdated, pendingDescription}, description: null });
        AlertsVC.getInstance().pushSuccessAlert('Изменения успешно сохранены');
      } else {
        // публикуем - выставляем description равным pendingDescription
        // TODO:  придумать, как быть с updated
        // придумал, теперь config.updated связано с pendingUpdated также
        // как description -> pendingDescription
        await pls.updateOne(p.id, {
          config: {
            updated: pendingUpdated ?? updated,
            pendingUpdated,
            pendingDescription,
          },
          description: pendingDescription ?? p.description,
        });
        // удаляем все пометки "просмотрено"
        const newsViewsService = NewsViewsService.getInstance();
        await newsViewsService.whenReady();
        const viewsItems = newsViewsService.getModel().filter(viewsItem => viewsItem.news_id === p.id);           // те, у которых "просмртрена" текущая новость
        const viewsItemIds = viewsItems.map(viewsItem => viewsItem.id);                                           // их id
        for (let viewsItemId of viewsItemIds) {
          await newsViewsService.remove(viewsItemId);
        }

        AlertsVC.getInstance().pushSuccessAlert('Новость успешно опубликована');
      }

    } catch (e) {
      AlertsVC.getInstance().pushDangerAlert('Сохранение не удалось');
    }
  };

  private _makeData() {
    let { news, searchTerm, minimalMode, views, } = this.props;
    let { page } = this.state;
    // алгоритм нахождения просмотренных новостей
    // все /**/непросмотренные переходят в статус просмотренных
    // через три секунды
    let unreadNews: number[] = [];
    if (minimalMode) {
      news = news.filter((prs: IRawNewsItem) => !!prs.description);
      unreadNews = getUnreadNews(news, views).arrayId;
    }
    // для поиска сохраним в выдаче "несуществующую" новую новость
    news = searchTerm ? news.filter(p => p.id == null || search(p.config.pendingDescription ?? p.description ?? '', searchTerm)) : news;

    const n = news.length;
    const countRow = !minimalMode ? NUMBER_OF_ROW : 3;
    const nPages = n > 0 ? Math.floor(n / countRow) + (n % countRow ? 1 : 0) : 1;
    if (nPages <= page) page = nPages - 1;
    news = news.slice(page * countRow, page * countRow + countRow);

    let pagesSet = {[0]: true, [nPages - 1]: true};
    range(page - 2, page + 3).filter(p => 0 <= p && p < nPages).forEach(pid => pagesSet[pid] = true);
    let validPages = Object.keys(pagesSet).filter(pid => pagesSet[pid]).map(pid => +pid).sort((a, b) => a - b);
    let pages = [];
    validPages.forEach((p, i) => {pages.push(p); if (validPages[i + 1] && validPages[i + 1] - validPages[i] !== 1) pages.push(null); });
    return {
      news,
      unreadNews,
      pages,
      page,
      nPages,
    };
  }

  public render() {
    const {minimalMode, className, currentEditingNews} = this.props;
    const { attendingToRemove, attendingToPublish, textPublishDialog, textRemoveDialog, newNewsToday} = this.state;
    const renderData = this._makeData();
    const { news, unreadNews, pages, page, nPages } = renderData;
    const allNews = this.props.news;
    return <ComponentTable
      classNameArticle={`NewsPage__Body`}
      classNameTable={`NewsListView folders`}
      minimalMode={minimalMode}
    >
      {
      <tr>
        <th></th>
        <th>Дата</th>
        <th>Новость</th>
        <th></th>
      </tr>
      }
      {!!news.length && news.map((newsItem, idx) => (
        <RowCV
          key={newsItem.id ? newsItem.id : `rowUniqueKey${idx}`}
          item={newsItem}
          isEditing={currentEditingNews === newsItem}
          onEditClick={(date, description) => this._onEditPress(newsItem, date, description)}
          onRemovePress={() => this._onRemovePress(newsItem)}
          textPublishDialog={textPublishDialog}
          textRemoveDialog={textRemoveDialog}
          onRemoveCancelPress={this._onCancelRemove}
          onRemoveApprovePress={() => this._removePresentation(newsItem, news, this.state.page)}
          onPublishPress={() => this._onPublishPress(newsItem)}
          onPublishCancelPress={this._onCancelPublish}
          onPublishApprovePress={() => this._publishNews(newsItem)}
          isHidden={newsItem.description != null && (newsItem.config.pendingDescription == null || newsItem.description === newsItem.config.pendingDescription)
          && (newsItem.config.updated === newsItem.config.pendingUpdated) ? 0 : 1}
          minimalMode={minimalMode}
          isAttendingToRemove={attendingToRemove === newsItem}
          isAttendingToPublish={attendingToPublish === newsItem}
          className={cn(`folder`, `NewsListView__Item`, {
            Highlighted: unreadNews.includes(newsItem.id),
            editing: currentEditingNews === newsItem,
            new: newsItem.id == null,
            NewsListView__NewItem: !newNewsToday.includes(newsItem.id),
          })}
        >
          {unreadNews.includes(newsItem.id)
            ? <IconLetterClosed/>
            : <IconLetterOpened/>}
        </RowCV>
      ))
      }
      { !!allNews.length && !news.length && !minimalMode &&
      <tr key={'notFound'}
          className="folder NewsListView__Item">
        <td colSpan={8} style={{textAlign: 'center'}}>Новостей с таким названием не найдено.</td>
      </tr>}

      { !allNews.length && !news.length && !minimalMode &&
      <tr style={{border: 'none'}}
          className="NewsListView__Item">
        <td className="NewsListView__Empty" colSpan={8} >Еще не создано ни одной новости.<br/> Нажмите на кнопку “Создать новость” для добавления новости.<br/>
          <svg style={{width: '4rem', height: '6rem'}} viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.1875 11.8125V19.6875H11.8125V11.8125H51.1875ZM51.1875 7.875H11.8125C10.7682 7.875 9.76669 8.28984 9.02827 9.02827C8.28984 9.76669 7.875 10.7682 7.875 11.8125V19.6875C7.875 20.7318 8.28984 21.7333 9.02827 22.4717C9.76669 23.2102 10.7682 23.625 11.8125 23.625H51.1875C52.2318 23.625 53.2333 23.2102 53.9717 22.4717C54.7102 21.7333 55.125 20.7318 55.125 19.6875V11.8125C55.125 10.7682 54.7102 9.76669 53.9717 9.02827C53.2333 8.28984 52.2318 7.875 51.1875 7.875Z" fill="#4CB0E6"/>
            <path d="M19.6875 31.5V51.1875H11.8125V31.5H19.6875ZM19.6875 27.5625H11.8125C10.7682 27.5625 9.76669 27.9773 9.02827 28.7158C8.28984 29.4542 7.875 30.4557 7.875 31.5V51.1875C7.875 52.2318 8.28984 53.2333 9.02827 53.9717C9.76669 54.7102 10.7682 55.125 11.8125 55.125H19.6875C20.7318 55.125 21.7333 54.7102 22.4717 53.9717C23.2102 53.2333 23.625 52.2318 23.625 51.1875V31.5C23.625 30.4557 23.2102 29.4542 22.4717 28.7158C21.7333 27.9773 20.7318 27.5625 19.6875 27.5625Z" fill="#4CB0E6"/>
            <path d="M51.1875 31.5V51.1875H31.5V31.5H51.1875ZM51.1875 27.5625H31.5C30.4557 27.5625 29.4542 27.9773 28.7158 28.7158C27.9773 29.4542 27.5625 30.4557 27.5625 31.5V51.1875C27.5625 52.2318 27.9773 53.2333 28.7158 53.9717C29.4542 54.7102 30.4557 55.125 31.5 55.125H51.1875C52.2318 55.125 53.2333 54.7102 53.9717 53.9717C54.7102 53.2333 55.125 52.2318 55.125 51.1875V31.5C55.125 30.4557 54.7102 29.4542 53.9717 28.7158C53.2333 27.9773 52.2318 27.5625 51.1875 27.5625Z" fill="#4CB0E6"/>
          </svg>
        </td>
      </tr>}

      { !news.length && minimalMode &&
      <tr style={{border: 'none'}}
          className="NewsListView__Item">
        <td style={{textAlign: 'center'}}>Новостей нет<br/>
        </td>
      </tr>}
      <Pagination
        pages={pages}
        activePage={page}
        onPrevClick={() => this.setState({ page: page > 0 ? page - 1 : page })}
        onPageClick={(pid) => this.setState({ page: pid })}
        onNextClick={() => this.setState({ page: page < range(nPages).length - 1 ? page + 1 : page })}
        className={cn(`Pagination ${className}`, {minimalMode})}
        classNamePrev={cn('Pagination__ArrowPrev', {disabled: page <= 0})}
        classNameNext={cn('Pagination__ArrowNext', {disabled: page >= pages.length - 1})}
        classNameFirstLastPage={cn({disabled: page > 0})}
        onFirstPageClick={() => this.setState({ page: 0 })}
        onLastPageClick={() => this.setState({ page: nPages - 1 })}
      />
    </ComponentTable>
  }
}
