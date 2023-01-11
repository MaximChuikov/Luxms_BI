import { ISelector } from './utils';

export class BaseSelector implements ISelector {

  public $container: JQuery;
  public minDate: moment.Moment = null;
  public maxDate: moment.Moment = null;
  public curDate: moment.Moment = null;
  protected _hilitedDate: moment.Moment = null;

  public constructor($parent: JQuery) {
    this.$container = $parent.append('<div></div>').children().last();
  }

  public setHilitedDate(value: moment.Moment): void {
    this._hilitedDate = value;
  }

  public setDate(value: moment.Moment): void {
    this.curDate = value;
  }

  public setRange(min: moment.Moment, max: moment.Moment) {
    this.minDate = min;
    this.maxDate = max;
  }

  public isVisible(): boolean {
    return this.$container.is(':visible');
  }

  /* protected */
  public toggleContainer(value: boolean): void {
    if (value) this.$container.show();
    else      this.$container.hide();
  }

  /* protected */
  protected toggleElement($e, value: boolean): void {
    if (value) {
      if ($e.hasClass('disabled')) {
        $e.removeClass('disabled');
        // if($e.is('button')){ $e.removeAttr('disabled'); }
      }
    } else {
      if (!$e.hasClass('disabled')) {
        $e.addClass('disabled');
        // if($e.is('button')){ $e.attr('disabled', 'true'); }
      }
    }
  }

  public redraw(): void {
    //
  }
}

