import $ from 'jquery';
import { BaseSelector } from './BaseSelector';
import { LEFT_ARROW_SVG, RIGHT_ARROW_SVG } from './utils';


export class MonthSelector extends BaseSelector {

  public constructor($parent: JQuery) {
    super($parent);
    this.$container.addClass('month-selector');
    this.$container.append('<button class="month dec">' + LEFT_ARROW_SVG + '</button>');
    this.$container.append('<button class="month value"></button>');
    this.$container.append('<button class="month inc">' + RIGHT_ARROW_SVG + '</button>');
  }

  private toggleDec(value: boolean) {
    this.toggleElement($('.dec', this.$container), value);
  }

  private toggleInc(value: boolean) {
    this.toggleElement($('.inc', this.$container), value);
  }

  public redraw(): void {
    $('.value', this.$container).html(this.curDate.format('MMMM'));
    var toggleDec = false;
    var toggleInc = false;
    if (this.minDate && this.maxDate) {
      var prevMonth = this.curDate.clone().subtract(1, 'months').endOf('month');
      var nextMonth = this.curDate.clone().add(1, 'months').startOf('month');
      toggleDec = (prevMonth.isAfter(this.minDate) || prevMonth.isSame(this.minDate));
      toggleInc = (nextMonth.isBefore(this.maxDate) || nextMonth.isSame(this.maxDate));
    } else {
      toggleDec = toggleInc = true;
    }
    this.toggleDec(toggleDec);
    this.toggleInc(toggleInc);

    if (this._hilitedDate && this._hilitedDate.year() === this.curDate.year() && this._hilitedDate.month() === this.curDate.month()) {
      this.$container.find('.value').addClass('current');
    } else {
      this.$container.find('.value').removeClass('current');
    }
  }
}
