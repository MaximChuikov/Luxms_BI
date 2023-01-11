import { BaseEntitiesService, createSingleton } from 'bi-internal/core';
import NewsViewsRepository, { IRawNewsViewsItem } from '../../repositories/vcp/newsViews';

export default class NewsViewsService extends BaseEntitiesService<IRawNewsViewsItem> {
  private constructor() {
    super(new NewsViewsRepository());
  }
  public static getInstance = createSingleton<NewsViewsService>(() => new NewsViewsService(), '__newsViewsService');
}
