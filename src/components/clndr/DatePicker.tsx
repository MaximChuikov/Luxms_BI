import { PeriodType } from "./PeriodType";
import $ from 'jquery';
import { YearSelector } from './YearSelector';
import { QuarterSelector } from './QuarterSelector';
import { MonthSelector } from './MonthSelector';
import { DateSelector } from './DateSelector';
import { BaseSelector } from './BaseSelector';
import { BasePicker } from './BasePicker';
import { TimerHelper } from './utils';


export class DatePicker extends BasePicker {

  private yearSelector: YearSelector;
  private quarterSelector: QuarterSelector;
  private monthSelector: MonthSelector;
  private dateSelector: DateSelector;
  private _hilitedSelector: BaseSelector;                          // the selector which will have hilite
  private callbackTmr: TimerHelper;
  private useAsWeeks: boolean;
  private _dateTitle: string;

  public constructor(container: HTMLElement, input: HTMLElement, cfg, isSelectable?: (d: moment.Moment, pt: PeriodType) => boolean) {
    super(container, input, cfg);
    if (this.cfg['dateFormat']) this.format = this.cfg['dateFormat'];
    this.yearSelector = new YearSelector(this.$container);
    this.quarterSelector = new QuarterSelector(this.$container);
    this.monthSelector = new MonthSelector(this.$container);
    this.dateSelector = new DateSelector(this.$container, isSelectable);
    this.callbackTmr = new TimerHelper(555, () => {
      this.callback.call(null, this.curDate);
    });
  }

  public setRange(min: moment.Moment, max: moment.Moment): void {
    this.minDate = min;
    this.maxDate = max;
    this.yearSelector.setRange(min, max);
    this.monthSelector.setRange(min, max);
    this.quarterSelector.setRange(min, max);
    this.dateSelector.setRange(min, max);
    this.redraw();
  }

  public setDate(value: moment.Moment, title: string = null): void {
    this.curDate = value;
    this._dateTitle = title;
    this._setVisibleDate(value);
    this._setHilitedDate(value);
    this.redraw();
  }

  private _setVisibleDate(value: moment.Moment): void {
    this.visibleDate = value;
    this.yearSelector.setDate(value);
    this.quarterSelector.setDate(value);
    this.monthSelector.setDate(value);
    this.dateSelector.setDate(value);

    this.yearSelector.redraw();
    this.quarterSelector.redraw();
    this.monthSelector.redraw();
    this.dateSelector.redraw();
  }

  private _setHilitedDate(value: moment.Moment): void {
    if (this._hilitedSelector) {
      this._hilitedSelector.setHilitedDate(value);
      this._hilitedSelector.redraw();
    }
  }

  private _changeHilitedSelector(sel: BaseSelector) {
    if (sel === this._hilitedSelector)
      return;

    if (this._hilitedSelector) {
      this._hilitedSelector.setHilitedDate(null);
    }
    this._hilitedSelector = sel;
  }

  public show(): void {
    $('.DsShell').addClass('datePickerOpen');
    this._setVisibleDate(this.curDate);
    this._setHilitedDate(this.curDate);
    super.show();
  }

  public hide() {
    super.hide();
    $('.DsShell').removeClass('datePickerOpen');
  }

  public toggleYears(): void {
    this.useAsWeeks = false;
    this.quarterSelector.toggleContainer(false);
    this.monthSelector.toggleContainer(false);
    this.dateSelector.toggleContainer(false);
    this._changeHilitedSelector(this.yearSelector);
  }

  public toggleQuarters(): void {
    this.useAsWeeks = false;
    this.quarterSelector.toggleContainer(true);
    this.monthSelector.toggleContainer(false);
    this.dateSelector.toggleContainer(false);
    if (this._hilitedSelector) this._hilitedSelector.setHilitedDate(null);
    this._changeHilitedSelector(this.quarterSelector);
  }

  public toggleMonths(): void {
    this.useAsWeeks = false;
    this.quarterSelector.toggleContainer(false);
    this.monthSelector.toggleContainer(true);
    this.dateSelector.toggleContainer(false);
    this._changeHilitedSelector(this.monthSelector);
  }

  public toggleDays(useAsWeeks: boolean): void {
    this.quarterSelector.toggleContainer(false);
    this.monthSelector.toggleContainer(true);

    // TODO: check the month selector is visible. Check the this.monthSelector.isVisible()
    this.useAsWeeks = useAsWeeks;
    this.dateSelector.toggleContainer(true);
    this.dateSelector.useAsWeeks = useAsWeeks;
    this._changeHilitedSelector(this.dateSelector);
  }

  public redraw(): void {
    if (null == this.curDate) return;
    this.yearSelector.redraw();
    this.quarterSelector.redraw();
    this.monthSelector.redraw();
    this.dateSelector.redraw();
    this.setInputValue(this._dateTitle || this.curDate.format(this.format));
  }

  public onClick(e: JQueryEventObject): void {
    e.originalEvent.preventDefault();
    e.originalEvent.stopImmediatePropagation();
    this.tmr.touch();
    var executeCallback: boolean = true;

    var $t: any = $(e.currentTarget);
    if ($t.hasClass('disabled')) return;
    var newDate: moment.Moment = this.visibleDate.clone();

    var isYear: boolean = $t.hasClass('year');
    var isQuarter: boolean = $t.hasClass('quarter');
    var isMonth: boolean = $t.hasClass('month');

    var isDec: boolean = $t.hasClass('dec');
    var isInc: boolean = $t.hasClass('inc');
    var isValue: boolean = $t.hasClass('value');

    if (isYear && isDec) {
      newDate.subtract(1, 'years');
      executeCallback = false;
    } else if (isYear && isInc) {
      newDate.add(1, 'years');
      executeCallback = false;
    } else if (isYear && isValue) {
      // do nothing - simple run callback

    } else if (isQuarter && isDec) {
      newDate.subtract(1, 'quarters');
      newDate.endOf('quarter');
      executeCallback = false;
    } else if (isQuarter && isInc) {
      newDate.add(1, 'quarters');
      newDate.startOf('quarter');
      executeCallback = false;
    } else if (isQuarter && isValue) {
      // do nothing - simple run callback

    } else if (isMonth && isDec) {
      newDate.subtract(1, 'months');
      if (this.useAsWeeks) newDate.endOf('month');
      executeCallback = false; // this.useAsWeeks;
    } else if (isMonth && isInc) {
      newDate.add(1, 'months');
      if (this.useAsWeeks) newDate.startOf('month');
      executeCallback = false; // executeCallback = this.useAsWeeks;
    } else if (isMonth && isValue) {
      // do nothing - simple run callback

    } else if ($t.hasClass('date')) {
      newDate.date(parseInt($t.text()));
      // this.hide();
    }

    if (newDate.isBefore(this.minDate)) {
      newDate = this.minDate.clone();
    }
    if (newDate.isAfter(this.maxDate)) {
      newDate = this.maxDate.clone();
    }

    if (executeCallback) {
      this.setDate(newDate);
      this.callback.call(null, this.curDate);
    } else {
      this._setVisibleDate(newDate);
    }
  }

  public onMouseWheel(e: JQueryEventObject): void {
    const $t: any = $(e.target);
    const direction = (e.originalEvent['wheelDelta'] > 0 || e.originalEvent['detail'] < 0 ? 'up' : 'down');
    let newDate = this.visibleDate.clone();

    const isYear: boolean = $t.hasClass('year');
    const isQuarter: boolean = $t.hasClass('quarter');
    const isMonth: boolean = $t.hasClass('month');

    if (isYear && direction == 'down') {
      newDate.subtract(1, 'years');
    } else if (isYear && direction == 'up') {
      newDate.add(1, 'years');
    } else if (isQuarter && direction == 'down') {
      newDate.subtract(1, 'quarters');
    } else if (isQuarter && direction == 'up') {
      newDate.add(1, 'quarters');
    } else if (isMonth && direction == 'down') {
      newDate.subtract(1, 'months');
    } else if (isMonth && direction == 'up') {
      newDate.add(1, 'months');
    }

    if (newDate.isBefore(this.minDate)) {
      newDate = this.minDate.clone();
    }
    if (newDate.isAfter(this.maxDate)) {
      newDate = this.maxDate.clone();
    }

    // this.setDate(newDate);
    // this.callbackTmr.touch();
    this._setVisibleDate(newDate);
    this.tmr.touch();
  }
}

