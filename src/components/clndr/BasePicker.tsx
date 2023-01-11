import $ from 'jquery';
import { ISelector, TimerHelper } from './utils';


export class BasePicker implements ISelector {

  /* all are protected */
  public $container: JQuery;
  public $input: JQuery;
  public cfg: any;
  public callback: (value: moment.Moment) => void;
  public displayCallback: (instance: BasePicker, value: boolean) => void;
  public minDate: moment.Moment = null;
  public curDate: moment.Moment = null;
  public maxDate: moment.Moment = null;
  public visibleDate: moment.Moment = null;
  public tmr: TimerHelper;
  public format: string;
  private visible: boolean = false;

  public constructor(container: HTMLElement, input: HTMLElement, cfg) {
    this.$container = $(container);
    this.$input = $(input);
    this.cfg = cfg || {};
    if (!this.cfg['locale']) this.cfg['locale'] = 'en';
    this.format = 'L LT'; // 'D.MM.YYYY h:mm';
    if (!this.cfg['hideDelay']) this.cfg['hideDelay'] = 3333;
    // TODO: jump-to-first, jump-to-last, remember-every-month
    if (!this.cfg['dateBehavior']) this.cfg['dateBehavior'] = 'default';
    moment.locale(this.cfg.locale);
    this.$container.on('click', 'button', (e: any) => {
      this.onClick(e);
    });
    this.$container.bind('mousewheel DOMMouseScroll', (e: any) => {
      this.onMouseWheel(e);
    });
    this.$input.click((e) => {
      this.toggleVisibility();
      if (e.originalEvent) {
        e.originalEvent.preventDefault();
        e.originalEvent.stopImmediatePropagation();
      }
    });

    // this.$input.keypress((e)=>{ this.showByInput() });
    // this.$input.focus((e)=>{ this.showByInput() });
    this.tmr = new TimerHelper(this.cfg.hideDelay, () => {
      this.hide();
    });
    this.callback = (value: moment.Moment) => {
      //
    }; // default
  }

  public getInputValue(): string {
    if (this.$input.is('input'))
      return String(this.$input.val()).trim();
    else
      return this.$input.text().trim();
  }

  public setInputValue(value: string): void {
    if (this.$input.is('input'))
      this.$input.val(value);
    else
      this.$input.text(value);
  }

  public show(): void {
    this.visible = true;
    this.$container.show();
    this.tmr.touch();
    this.displayCallback.call(null, this, true);
  }

  public hide(): void {
    this.visible = false;
    this.$container.hide();
    this.displayCallback.call(null, this, false);
  }

  public toggleVisibility(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  public setDate(value) {
    //
  }

  public redraw(): void {
    //
  }

  public onClick(e: JQueryEventObject) {
    //
  }

  public onMouseWheel(e: JQueryEventObject) {
    //
  }

  public onChange(callback: (value: moment.Moment) => void): void {
    this.callback = callback;
  }

  public onDisplay(callback: (instance: BasePicker, value: boolean) => void) {
    this.displayCallback = callback;
  }
}

