import * as React from "react";
import {IRawNewsItem} from "../../../repositories/vcp/news";
import {AppConfig, AuthenticationService, urlState} from "bi-internal/core";
import ButtonLink from "../ButtonLink/ButtonLink";
import IconHome from "../IconHome/IconHome";
import ButtonPrimitive from "../ButtonPrimitive/ButtonPrimitive";
import ComponentInput from "../ComponentInput/ComponentInput";
import IconSearch from "../IconSearch/IconSearch";
import IconCross from "../IconCross/IconCross";
import {IRawNewsViewsItem} from "../../../repositories/vcp/newsViews";
import ComponentTableCV from "../ComponentTable/ComponentTableCV";
import './ComponentAccess.scss';
import RoleControl from '../../../components/RoleControl/RoleControl'

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

const ComponentAccess = (props: IComponentNewsProps) => {
  const {
    news, minimalMode, onClickClose, className, views,
    searchTerm, thumbnailContent, lastPage, currentEditingNews,
    onClickHome, createNews, onSearchTermChanged, setNewsItemEditable
  } = props;

  const user = AuthenticationService.getModel() as any;
  const sysConfig = (AuthenticationService.getModel() as any).sys_config;
  const hideTabRoleControl = user && sysConfig && sysConfig.hide_tab_role_control;

  return (
    <article className={`NewsPage view presentations ${className}`}>
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
                <li>
                  <a href="/#/news">Новости</a>
                </li>
                <li className="active" style={{display: hideTabRoleControl ? `none` : `list-item`}}>
                  <a href="/#/access">Доступ</a>
                </li>
              </ul>
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
      <div className="NewsPage__Body">
        <RoleControl baseUrl='/' />
      </div>
    </article>);
}

export default ComponentAccess;
