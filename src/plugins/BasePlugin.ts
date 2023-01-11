import { IDsToolbarButton, IPlugin, IRootSegment } from './plugins-model';
import { BaseService, disposeAll } from 'bi-internal/core';
import { IDatasetModel } from '../services/ds/types';


export class BasePlugin implements IPlugin {

  public getRootSegments?(): IRootSegment[] {
    return [];
  }

  public getDrillDownMenuItems(ddMenu: any, dataset: IDatasetModel, vcpv: IVCPV, vcpAction?: any): any[] {
    return [];
  }

  public createVCDsToolbarButtons(dataset: IDatasetModel): BaseService<IDsToolbarButton>[] {
    return [];
  }

  public subscribeDsToolbarButtons(dataset: IDatasetModel, cb: (bs: IDsToolbarButton[]) => void, immediateNotify: boolean = false): IDisposable {
    let vcs: BaseService<IDsToolbarButton>[] = this.createVCDsToolbarButtons(dataset);
    const onDepsUpdated = () => {
      const buttons: IDsToolbarButton[] = vcs.map(vc => vc.getModel());
      cb(buttons);
    };
    if (immediateNotify) {
      onDepsUpdated();
    }
    let subscriptions: IDisposable[] = vcs.map(vc => vc.subscribeUpdates(onDepsUpdated));

    return {
      dispose: () => {
        disposeAll(subscriptions);
        vcs.forEach(vc => vc.release());
        vcs = null;
      },
    };
  }
}
