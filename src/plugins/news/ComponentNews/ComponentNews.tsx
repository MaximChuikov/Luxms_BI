import * as React from "react";
import {IRawNewsItem} from "../../../repositories/vcp/news";
import {AuthenticationService, urlState} from "bi-internal/core";
import ButtonLink from "../ButtonLink/ButtonLink";
import IconHome from "../IconHome/IconHome";
import ButtonPrimitive from "../ButtonPrimitive/ButtonPrimitive";
import ComponentInput from "../ComponentInput/ComponentInput";
import IconSearch from "../IconSearch/IconSearch";
import IconCross from "../IconCross/IconCross";
import {IRawNewsViewsItem} from "../../../repositories/vcp/newsViews";
import ComponentTableCV from "../ComponentTable/ComponentTableCV";
import './ComponentNews.scss';

interface IComponentNewsProps {
  news: IRawNewsItem[];
  views: IRawNewsViewsItem[];
  lastPage: number;
  currentEditingNews: IRawNewsItem | null;
  pendingNewsItem: IRawNewsItem | null;
  thumbnailContent: string;
  searchTerm: string;
  onClickHome: (event: MouseEvent) => void;
  createNews: (news: IRawNewsItem []) => void;
  onSearchTermChanged: (searchText: string) => void;
  setNewsItemEditable: (newsItem: IRawNewsItem) => void;
  minimalMode?: boolean;
  onClickClose?: () => void;
  className?: string;
}

const ComponentNews = (props: IComponentNewsProps) => {
  const {
    news, minimalMode, onClickClose, className, views,
    searchTerm, thumbnailContent, lastPage, currentEditingNews,
    onClickHome, createNews, onSearchTermChanged, setNewsItemEditable
  } = props;
  const user = AuthenticationService.getModel() as any;
  const sysConfig = (AuthenticationService.getModel() as any).sys_config;
  const hideTabRoleControl = user && sysConfig && sysConfig.hide_tab_role_control;

  return (
    <article className={`NewsPage view presentations ${className} custom`}>
      {!minimalMode
        ? <React.Fragment>
          <header className="Root__Header">
            <h1 style={{justifyContent: 'flex-start', paddingLeft: 15}}>
              <a href={urlState.buildUrl({segment: 'ds', segmentId: 'ds_7', route: '#dashboards', dboard: 1})}
                 className="Root__HeaderThumbnail "
                 dangerouslySetInnerHTML={{__html: thumbnailContent}}/>
            </h1>

            <div className="Root__Icons">
              <ButtonLink onButtonClick={onClickHome}
                          style={{
                            width: `calc( 28.5rem / 13)`,
                            height: `calc( 28.1rem / 13)`,
                            marginRight: `calc(20rem / 13)`,
                          }}
              >
                <IconHome/>
              </ButtonLink>
            </div>
          </header>

          <header className="NewsPage__Header">
            <div className="NewsNavigation__Wrapper">
              <ul className="NewsNavigation">
                <li className="active">
                  <a href="/#/news">Новости</a>
                </li>
                <li>
                  <a href="/#/access" style={{display: hideTabRoleControl ? `none` : `list-item`}}>Доступ</a>
                </li>
              </ul>
            </div>
            <div className="NewsPage__HeaderWrapper">
              <ButtonPrimitive title={`Создать новость`} onButtonClick={() => createNews(news)}/>
            </div>
            <div className="NewsPage__HeaderPanel">
              <ComponentInput className={`NewsPage__SearchInput`} value={searchTerm}
                              handlerChange={(event) => onSearchTermChanged(event.target.value)}/>
              <IconSearch/>
            </div>
          </header>
        </React.Fragment>
        :
        <header className="NewsNotifications__Header">
          <div className="NewsNotifications__Columns">
            <div className="NewsNotifications__Title">
              <h2>Новости</h2>
            </div>
            <div className="NewsNotifications__Close">
              <ButtonLink onButtonClick={onClickClose}
                          style={{
                            marginTop: `0.85rem`,
                          }}
              >
                <IconCross/>
              </ButtonLink>
            </div>
          </div>
        </header>
      }
      <ComponentTableCV news={news}
                        views={views}
                        searchTerm={searchTerm}
                        lastPage={lastPage}
                        currentEditingNews={currentEditingNews}
                        setNewsItemEditable={setNewsItemEditable}
                        minimalMode={minimalMode}
                        className={className}
      />
    </article>);
}

export default ComponentNews;
