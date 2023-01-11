/// <reference path="../../../defs/moment.d.ts" />
/// <reference path="../../../defs/jqueryui.d.ts" />
/// <reference path="../../../defs/bi.d.ts" />

declare var moment;
declare var Luxms: any;

export const LEFT_ARROW_SVG: string = '<svg style="width: 1.8rem; height:1.8rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path transform="rotate(-90 12.718666076660158,12.023870468139648) " id="svg_2" d="m5.18533,18.61553l7.53332,-13.18332l7.53334,13.18332l-15.06667,0z" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" stroke="#ffffff" fill="#ffffff"/><path id="svg_3" d="m11.21533,11.21921l0.745,-1.30375l0.745,1.30375z" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" stroke="#ffffff" fill="#ffffff"/></g></svg>';
export const RIGHT_ARROW_SVG: string = '<svg style="width: 1.8rem; height:1.8rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path transform="rotate(89.84123992919922 12.718665122985842,12.023869514465332) " id="svg_2" d="m5.18533,18.61553l7.53332,-13.18332l7.53334,13.18332l-15.06667,0z" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" stroke="#ffffff" fill="#ffffff"/><path id="svg_3" d="m11.21533,11.21921l0.745,-1.30375l0.745,1.30375z" stroke-linecap="null" stroke-linejoin="null" stroke-width="0" stroke="#ffffff" fill="#ffffff"/></g></svg>';

export interface IPeriodsPickerConfig {
  hideDelay?: number;
  locale?: string;
  // dateFormat: 'D.MM.YYYY',
  dateFormat?: string;
  timeFormat?: string;
  defaultColor?: string;
  selectedColor?: string;
  errorColor?: string;
}

export interface ISelector {
  setDate(value);
  redraw();
}

export interface IPeriodsPickerVM {
  cfg: IPeriodsPickerConfig;
  onChange?(from: moment.Moment, to: moment.Moment): void;
}


export class TimerHelper {
  private _t: number;

  constructor(private delay: number, private cb) {
    //
  }

  public touch(): void {
    this.clear();
    this._t = window.setTimeout(this.cb, this.delay);
  }

  public clear(): void {
    if (this._t) window.clearTimeout(this._t);
    this._t = null;
  }
}


export class PeriodProxy {
  public x: number;
  public width: number;
  public source: IPeriod;

  public constructor(source: IPeriod) {
    this.source = source;
  }

  public equal(value: PeriodProxy): boolean {
    if (!value) return false;
    return value.source.period_id == this.source.period_id;
  }
}
