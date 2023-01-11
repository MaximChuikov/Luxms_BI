import { IDatasetModel } from '../services/ds/types';


export interface IDsToolbarButton {
  loading?: boolean;
  error?: string;
  title: string;
  className?: string;
  href: string;
  icon?: string;
  active?: boolean;
  onPress: (event) => void;
}


export interface IPlugin {
  id: string;
  getRootSegments?(): IRootSegment[];
  getDrillDownMenuItems?(ddMenu: any, dataset: IDatasetModel, vcpv: IVCPV, vcpAction?: any): any[];
  subscribeDsToolbarButtons?(dataset: IDatasetModel, cb: (bs: IDsToolbarButton[]) => void, immediateNotify?: boolean): IDisposable;
}


export interface IRootSegment {
  title: string;
  url: string;
  key: string;
  bgColor?: string;
  getTabElementClass?(): any;
  getBodyElementClass?(): any;
  tabElementClassCached?: any;    // TODO: move to View class
  bodyElementClassCached?: any;   // TODO: move to View class
}

