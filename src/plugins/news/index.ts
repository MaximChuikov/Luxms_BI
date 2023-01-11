/**
 * NewsPlugin
 *
 * a pluggable object to inject into application
 */


import ComponentNewsCV from './ComponentNews/ComponentNewsCV';
import { IRootSegment } from '../plugins-model';
import { BasePlugin } from '../BasePlugin';
import { BaseService } from 'bi-internal/core';
import { lang } from 'bi-internal/utils';
import ComponentAccessCV from './ComponentAccess/ComponentAccessCV';
import NewsNotificationsCV from "./NewsNotifications/NewsNotificationsCV";
import NewsService from "../../services/vcp/NewsService";
import NewsViewsService from "../../services/vcp/NewsViewsService";



export default class NewsPlugin extends BasePlugin {

  public constructor() {
    super();
  }

  // @override
  public getRootSegments(): IRootSegment[] {
    return [{
      title: lang('news'),
      key: 'news',
      url: '#/news/',
      bgColor: '#bbdefb',
      getBodyElementClass: () => ComponentNewsCV,
    },{
      title: lang('access'),
      key: 'access',
      url: '#/access/',
      bgColor: '#bbdefb',
      getBodyElementClass: () => ComponentAccessCV,
    }];
  }

  // используется из Root для показа нотификаций
  public NewsNotifications = NewsNotificationsCV;
  public NewsService = NewsService;
  public NewsViewsService = NewsViewsService;
}
