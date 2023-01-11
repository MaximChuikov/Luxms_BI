import { repo } from 'bi-internal/core';

export interface IRawNewsViewsItem {
  id: number;
  news_id: number;
  user_id: number;
  seen_time: string;
  config: any;
  created: string;
  updated: string;
}

export default class NewsViewsRepository extends repo.BaseRepository<IRawNewsViewsItem> {
  public constructor() {
    super('vcp', 'news_views');
  }
}
