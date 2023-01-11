import { repo } from 'bi-internal/core';

export interface IRawNewsItem {
  id: number;
  dataset_id: number;
  user_id: number;
  title: string;
  description: string;
  is_hidden: number;
  start_time: string;
  expiration_time: string;
  config: any;
  created: string;
  updated: string;
}

export default class NewsRepository extends repo.BaseRepository<IRawNewsItem> {
  public constructor() {
    super('vcp', 'news');
  }
}
