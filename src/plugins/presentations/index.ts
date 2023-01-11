/**
 * PresentationsPlugin
 *
 * a pluggable object to inject into application
 */


import { NavigatePresentationButtonVC, PresentationsTabContent, SaveSlideToolbarButtonVC } from './presentations';
import { IDsToolbarButton, IRootSegment } from '../plugins-model';
import { BasePlugin } from '../BasePlugin';
import { BaseService } from 'bi-internal/core';
import { IDatasetModel } from '../../services/ds/types';
import { lang } from 'bi-internal/utils';


export default class PresentationsPlugin extends BasePlugin {

  public constructor() {
    super();
  }

  public createVCDsToolbarButtons(dataset: IDatasetModel): BaseService<IDsToolbarButton>[] {
    return [
      new NavigatePresentationButtonVC(),
      new SaveSlideToolbarButtonVC(dataset.schemaName),
    ];
  }

  // @override
  public getRootSegments(): IRootSegment[] {
    return [{
      title: lang('presentations'),
      key: 'presentations',
      url: '#/presentations/',
      bgColor: '#bbdefb',
      getBodyElementClass: () => PresentationsTabContent,
    }];
  }
}
