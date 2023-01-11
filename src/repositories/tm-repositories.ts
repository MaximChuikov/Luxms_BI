import { repo } from 'bi-internal/core';

export interface IRawTMTask {
  id: number;
  performer_id: number;
  user_id: number;
  dataset_id: number;
  cron: string;
  delta: any;
  title: string;
  created: string;
  updated: string;
  config: any;
}

export class TMTasksRepository extends repo.BaseRepository<IRawTMTask> {

  // /api/db/tm.tasks
  public constructor() {
    super('tm', 'tasks');
  }
}
