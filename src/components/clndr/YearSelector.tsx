import $ from 'jquery';
import { BaseSelector } from './BaseSelector';
import { LEFT_ARROW_SVG, RIGHT_ARROW_SVG } from './utils';


export class YearSelector extends BaseSelector {
  constructor($parent) {
    super($parent);
    this.$container.addClass('year-selector');
    this.$container.append('<button class="year dec">' + LEFT_ARROW_SVG + '</button>');
    this.$container.append('<button class="year value"></button>');
    this.$container.append('<button class="year inc">' + RIGHT_ARROW_SVG + '</button>');
  }

  private toggleDec(value: boolean) {
    this.toggleElement($('.dec', this.$container), value);
  }

  private toggleInc(value: boolean) {
    this.toggleElement($('.inc', this.$container), value);
  }

  public redraw() {
    $('.value', this.$container).html(this.curDate.format('YYYY'));
    const prevYear = this.curDate.clone().startOf('year').subtract(1, 'years');
    const nextYear = this.curDate.clone().startOf('year').add(1, 'years');
    this.toggleDec(true);
    this.toggleInc(true);
    if (this.minDate) this.toggleDec(!prevYear.isBefore(this.minDate.clone().startOf('year')));
    if (this.maxDate) this.toggleInc(!nextYear.isAfter(this.maxDate.clone().startOf('year')));
    if (this._hilitedDate && this._hilitedDate.year() === this.curDate.year()) {
      this.$container.find('.value').addClass('current');
    } else {
      this.$container.find('.value').removeClass('current');
    }
  }
}
