import { IRawTMTask, TMTasksRepository } from '../../repositories/tm-repositories';
import { BaseEntitiesService } from 'bi-internal/core';


export class TMTasksService extends BaseEntitiesService<IRawTMTask> {
  //protected _repo: TMTasksRepository;

  public constructor() {
    super(new TMTasksRepository());
  }
}
