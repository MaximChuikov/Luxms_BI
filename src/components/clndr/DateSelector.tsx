/// <reference path="../../../defs/bi.d.ts" />
/// <reference path="../../../defs/jqueryui.d.ts" />

import $ from 'jquery';
import { PeriodType } from "./PeriodType";
import { BaseSelector } from './BaseSelector';


export class DateSelector extends BaseSelector {

  public useAsWeeks: boolean;
  private _isSelectable: (d: moment.Moment, pt: PeriodType) => boolean = null;

  public constructor($parent: JQuery, isSelectable?: (d: moment.Moment, pt: PeriodType) => boolean) {
    super($parent);
    this.$container.addClass('date-selector');
    this._isSelectable = isSelectable;
  }

  public redraw(): void {
    this.$container.html('');
    const $weekdays: JQuery = $('<div class="weekdays"></div>');
    this.$container.append($weekdays);

    var dm: number = this.curDate.daysInMonth();
    var dow1 = this.curDate.clone().startOf('month').weekday();
    var fdow = moment.localeData()['firstDayOfWeek']();
    var wd = moment.weekdaysMin();
    if (fdow == 1) {
      var su = wd.shift();
      wd.push(su);
    }
    while (wd.length) $weekdays.append('<div class="weekday-title">' + wd.shift() + '</div>');
    var padding = fdow + dow1;
    while (0 < --padding) {
      this.$container.append('<div class="date-padding noselect">&nbsp;</div>');
    }

    const min: moment.Moment = (this.minDate ? this.minDate.clone().hours(0) : null);
    const max: moment.Moment = (this.maxDate ? this.maxDate.clone().hours(0) : null);

    for (var d = 1; d <= dm; ++d) {
      const $e: JQuery = $('<button class="date"></button>').text(d);
      this.$container.append($e);
      const dt: moment.Moment = this.curDate.clone().date(d).hours(0);
      if ((min && dt.isBefore(min)) || (max && dt.isAfter(max)) || (this._isSelectable && !this._isSelectable(dt, this.useAsWeeks ? PeriodType.Weeks : PeriodType.Days))) {
        this.toggleElement($e, false);
      } else {
        if (this._hilitedDate && this.useAsWeeks) {
          if (this._hilitedDate.week() == this.curDate.clone().date(d).week()) $e.addClass('current');
        } else if (this._hilitedDate && this.curDate.year() == this._hilitedDate.year() && this.curDate.month() == this._hilitedDate.month()) {
          if (d == this._hilitedDate.date()) $e.addClass('current');
        }
      }
    }
  }
}

