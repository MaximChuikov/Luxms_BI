import {IDateTimePickerVM} from "../../../view-controllers/panels/PanelPeriods/PanelPeriodsVC";
import * as React from "react";
import {DateTimePicker} from "../../../components/clndr/DateTimePicker";
import {BIIcon} from "bi-internal/ui";
import cn from 'classnames';
import './DateTimePickerN.scss';

export interface IDateTimePickerNProps extends IDateTimePickerVM {
  isVisible: boolean;
  value: Date | moment.Moment | null;
  focus: boolean;
}

export class DateTimePickerN extends React.Component<IDateTimePickerNProps> {
  public props: IDateTimePickerNProps;
  public datepickerComponent: DateTimePicker = null;

  public constructor(props: IDateTimePickerNProps) {
    super(props);

  }

  public componentDidMount(): void {
    const container: HTMLElement = this.refs.container as HTMLElement;
    const $container: JQuery = $(container);
    const datePicker: HTMLElement = $container.find('#datePicker')[0];
    const dateInput: HTMLElement = $container.find('#dateInput')[0];
    const timePicker: HTMLElement = $container.find('#timePicker')[0];
    const timeInput: HTMLElement = $container.find('#timeInput')[0];

    this.datepickerComponent = new DateTimePicker(
      datePicker,
      dateInput,
      timePicker,
      timeInput,
      this.props.cfg,
      this.props.isSelectable);

    if (this.props.onDisplay) this.datepickerComponent.onDisplay(this.props.onDisplay);
    if (this.props.onChange) this.datepickerComponent.onChange(this.props.onChange);
    this.datepickerComponent.setDate(moment(this.props.value));
    this.UNSAFE_componentWillReceiveProps(this.props);
    document.addEventListener('click', this.handleClickOutside);
  }

  public detached(container: HTMLElement): void {
    // TODO: remove component
    this.datepickerComponent.dispose();
    this.datepickerComponent = null;
  }

  public UNSAFE_componentWillReceiveProps(props: IDateTimePickerVM) {
    if (!this.datepickerComponent) {
      return;
    }
    const dtp: DateTimePicker = this.datepickerComponent;
    const startOfYear: moment.Moment = moment().startOf(`year`);
    const endOfMonth: moment.Moment = moment().endOf(`month`);
    dtp.setRange(startOfYear, endOfMonth);
    dtp.toggleDays(false);

  }

  public hide() {
    this.datepickerComponent.datePicker.hide();
  }

  private _handleClickDatePickerIcon = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.datepickerComponent.datePicker.toggleVisibility();
  };

  private _handleClickTimePickerIcon = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.datepickerComponent.timePicker.toggleVisibility();
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const datePicker = document.querySelector(`.DateTimePicker__DateInputContainer`);
    if (!datePicker.contains(event.target)) {
      this.hide();
    }
  }

  public render() {
    const {isVisible, isTimeVisible, description, focus} = this.props;
    return (
      <section className="DateTimePicker" ref="container" >

        <div style={{display: isVisible ? 'inline-block' : 'none'}}>

          {!!description &&
          <div className="DateTimePicker__Description">
            {description}
          </div>}

          <div className={cn(`DateTimePicker__DateInputContainer`,{focus})}
               onClick={this._handleClickDatePickerIcon}>
            <div className="input-group input-group-sm" style={{display: 'flex'}}>
              <input className="DateTimePicker__DateInput form-control"
                     id="dateInput"
                     autoComplete="off"
                     readOnly={true}/>
              <BIIcon icon="date-picker-calendar"
                      // onPress={this._handleClickDatePickerIcon}
                      className="DateTimePicker__DateIcon bi-icon dark input-group-addon"/>
            </div>
            <div id="datePicker" className="dtpkr"/>
          </div>

          <div className="DateTimePicker__TimeInputContainer" style={{display : isTimeVisible ? 'inline-block' : 'none'}}>
            <div className="input-group input-group-sm" style={{display: 'flex'}}>
              <input className="form-control"
                     id="timeInput"
                     autoComplete="off"
                     readOnly={true}/>
              <BIIcon icon="time-picker"
                      onPress={this._handleClickTimePickerIcon}
                      className="bi-icon dark input-group-addon "
                      style={{background: 'white', cursor: 'pointer', width: 32}}/>
            </div>
            <div id="timePicker" className="tmpkr" style={{right: -100}}/>
          </div>
        </div>
      </section>);
  }
}
