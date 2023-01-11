import { BaseEntitiesService, createSingleton } from 'bi-internal/core';
import NewsRepository, { IRawNewsItem } from '../../repositories/vcp/news';

export default class NewsService extends BaseEntitiesService<IRawNewsItem> {
  private constructor() {
    super(new NewsRepository());
  }
  public static getInstance = createSingleton<NewsService>(() => new NewsService(), '__newsService');
}
