import { PeriodType } from "./PeriodType";
import { BasePicker } from './BasePicker';
import { TimePicker } from './TimePicker';
import { DatePicker } from './DatePicker';


export class DateTimePicker {

  public datePicker: DatePicker;
  public timePicker: TimePicker;
  private extCallback: (value: moment.Moment) => void;
  private displayCallback: (instance: BasePicker, value: boolean) => void;
  private minDate: moment.Moment = null;
  public curDate: moment.Moment = null;
  private maxDate: moment.Moment = null;

  public constructor(dateContainer: HTMLElement, dateInput: HTMLElement, timeContainer: HTMLElement, timeInput: HTMLElement, cfg: any, isSelectable?: (d: moment.Moment, pt: PeriodType) => boolean) {
    this.datePicker = new DatePicker(dateContainer, dateInput, cfg, isSelectable);
    this.timePicker = new TimePicker(timeContainer, timeInput, cfg, isSelectable);
    this.datePicker.onChange(this._onDateChange);
    this.timePicker.onChange(this._onTimeChange);
    this.datePicker.onDisplay(this._onDisplayChangeInternal);
    this.timePicker.onDisplay(this._onDisplayChangeInternal);
  }

  public dispose(): void {
    //
  }

  public setRange(min: moment.Moment, max: moment.Moment): void {
    min = min.clone();
    max = max.clone();
    this.resetTimePart(min);
    this.resetTimePart(max);
    this.minDate = min;
    this.maxDate = max;
    this.datePicker.setRange(min, max);
    this.timePicker.setRange(min, max);
    // check dates range
    // if(this.curDate){
    //  if(this.curDate.isBefore(this.minDate)) this.setDate(min.clone());
    //  if(this.curDate.isAfter(this.maxDate)) this.setDate(max.clone());
    // }
  }

  public setDate(value: moment.Moment, title: string = null) {
    value = value.clone();
    this.resetTimePart(value);
    // check dates range
    // if(this.minDate && value.isBefore(this.minDate)) { value = this.minDate; }
    // if(this.maxDate && value.isAfter(this.maxDate)) { value = this.maxDate; }
    this.curDate = value;
    this.datePicker.setDate(value, title);
    this.timePicker.setDate(value);
  }

  public toggleYears(): void {
    this.datePicker.toggleYears();
  }

  public toggleQuarters(): void {
    this.datePicker.toggleQuarters();
  }

  public toggleMonths(): void {
    this.datePicker.toggleMonths();
  }

  public toggleDays(useAsWeeks: boolean): void {
    this.datePicker.toggleDays(useAsWeeks);
  }

  public toggleTime(value: boolean) {
    this.timePicker.$input.toggle(value);
  }

  public hide() {
    this.datePicker.hide();
    this.timePicker.hide();
  }

  public onChange(callback: (value: moment.Moment) => void): void {
    this.extCallback = callback;
  }

  public onDisplay(callback: (instance: BasePicker, value: boolean) => void) {
    this.displayCallback = callback;
  }

  private resetTimePart(value: moment.Moment): void {
    if (!value) return;
    value.milliseconds(0);
    value.seconds(0);
    value.minutes(0);
  }

  private _onDateChange = (value: moment.Moment): void => {
    if (!value) return;
    if (!value.isSame(this.curDate)) {
      this.curDate = value;
      this.timePicker.redraw();
      this.notifyCallback();
    }
  };

  private _onTimeChange = (value: moment.Moment): void => {
    if (!value) return;
    if (!value.isSame(this.curDate)) {
      this.curDate = value;
      this.datePicker.redraw();
      this.notifyCallback();
    }
    // this.hide();
  };

  private _onDisplayChangeInternal = (instance: BasePicker, value: boolean) => {
    if (value && instance === this.datePicker) {
      this.timePicker.hide();
    }
    if (value && instance === this.timePicker) {
      this.datePicker.hide();
    }
    if (this.displayCallback) this.displayCallback.call(null, instance, value);
  };

  private notifyCallback(): void {
    if (this.extCallback) this.extCallback.call(null, this.curDate);
  }
}
