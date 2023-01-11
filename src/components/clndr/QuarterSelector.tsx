import $ from 'jquery';
import { BaseSelector } from './BaseSelector';
import { LEFT_ARROW_SVG, RIGHT_ARROW_SVG } from './utils';


export class QuarterSelector extends BaseSelector {

  public constructor($parent: JQuery) {
    super($parent);
    this.$container.addClass('quarter-selector');
    this.$container.append('<button class="quarter dec">' + LEFT_ARROW_SVG + '</button>');
    this.$container.append('<button class="quarter value"></button>');
    this.$container.append('<button class="quarter inc">' + RIGHT_ARROW_SVG + '</button>');
  }

  private toggleDec(value: boolean) {
    this.toggleElement($('.dec', this.$container), value);
  }

  private toggleInc(value: boolean) {
    this.toggleElement($('.inc', this.$container), value);
  }

  private _getFormattedTitle(): string {
    var q: number = this.curDate.quarter() - 1;
    return Luxms.lang.quarters_titles[q];
  }

  public redraw(): void {
    $('.value', this.$container).html(this._getFormattedTitle());
    let toggleDec: boolean = false;
    let toggleInc: boolean = false;
    if (this.minDate && this.maxDate) {
      var prevQuarter = this.curDate.clone().subtract(1, 'quarters').endOf('quarter');
      var nextQuarter = this.curDate.clone().add(1, 'quarters').startOf('quarter');
      toggleDec = (prevQuarter.isAfter(this.minDate) || prevQuarter.isSame(this.minDate));
      toggleInc = (nextQuarter.isBefore(this.maxDate) || nextQuarter.isSame(this.maxDate));
    } else {
      toggleDec = toggleInc = true;
    }
    this.toggleDec(toggleDec);
    this.toggleInc(toggleInc);
    if (this._hilitedDate && this._hilitedDate.year() === this.curDate.year() && this._hilitedDate.quarter() === this.curDate.quarter()) {
      this.$container.find('.value').addClass('current');
    } else {
      this.$container.find('.value').removeClass('current');
    }
  }
}
