import * as React from 'react';
import { DateTimePicker } from './DateTimePicker';
// import { IDateTimePickerVM } from '../../../view-controllers/panels/PanelPeriods/PanelPeriodsVC';
import './DateTimePickerR.scss';
import { BIIcon } from 'bi-internal/ui';
import { DatePicker } from '../DatePicker/DatePicker';
import { DateUtils } from '../DatePicker/DateUtils';
import $ from 'jquery';

export interface IDateTimePickerProps extends IDateTimePickerVM {
  isVisible: boolean;
}

export class DateTimePickerR extends React.Component<IDateTimePickerProps> {
  public props: IDateTimePickerProps;
  public datepickerComponent: DateTimePicker = null;

  public state: {
    expanded: boolean;
  } = {
    expanded: false,
  };

  public constructor(props: IDateTimePickerProps) {
    super(props);
  }

  public componentDidMount(): void {
    if (this.state.expanded) {
      $('.DsShell').addClass('datePickerOpen');
    } else {
      $('.DsShell').removeClass('datePickerOpen');
    }

    // const container: HTMLElement = this.refs.container as HTMLElement;
    // const $container: JQuery = $(container);
    // const datePicker: HTMLElement = $container.find('#datePicker')[0];
    // const dateInput: HTMLElement = $container.find('#dateInput')[0];
    // const timePicker: HTMLElement = $container.find('#timePicker')[0];
    // const timeInput: HTMLElement = $container.find('#timeInput')[0];
    //
    // this.datepickerComponent = new DateTimePicker(
    //   datePicker,
    //   dateInput,
    //   timePicker,
    //   timeInput,
    //   this.props.cfg,
    //   this.props.isSelectable);
    //
    // if (this.props.onDisplay) this.datepickerComponent.onDisplay(this.props.onDisplay);
    // if (this.props.onChange) this.datepickerComponent.onChange(this.props.onChange);
    //
    // this.componentWillReceiveProps(this.props);
  }

  public componentWillUnmount() {
    $('.DsShell').removeClass('datePickerOpen');
  }

  public componentDidUpdate(prevProps: Readonly<IDateTimePickerProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.state.expanded) {
      $('.DsShell').addClass('datePickerOpen');
    } else {
      $('.DsShell').removeClass('datePickerOpen');
    }
  }

  public detached(container: HTMLElement): void {
    // TODO: remove component
    if (this.datepickerComponent) {
      this.datepickerComponent.dispose();
      this.datepickerComponent = null;
    }
  }

  public componentWillReceiveProps(props: IDateTimePickerVM) {
    /*
    if (!this.datepickerComponent) {
      return;
    }
    const dtp: DateTimePicker = this.datepickerComponent;
    const {selectedPeriodType, selectedPeriod, selectedPeriods, allPeriods} = props;

    if (allPeriods.length === 0) {
      return;
    }
    const startDate: moment.Moment = allPeriods[0].startDate;
    const endDate: moment.Moment = allPeriods[allPeriods.length - 1].startDate;

    dtp.setRange(startDate, endDate);

    switch (selectedPeriodType) {
      case PeriodType.Seconds:
      case PeriodType.Minutes:
      case PeriodType.Hours:
      case PeriodType.Days:
        dtp.toggleDays(false);
        break;

      case PeriodType.Weeks:
        dtp.toggleDays(true);
        break;

      case PeriodType.Months:
        dtp.toggleMonths();
        break;

      case PeriodType.Quarters:
        dtp.toggleQuarters();
        break;

      case PeriodType.Years:
        dtp.toggleYears();
        break;

      default:
        throw new Error('Unknown periodType: ' + String(selectedPeriodType));
    }

    dtp.setDate(selectedPeriod.startDate, (selectedPeriodType < PeriodType.Days) ? null : selectedPeriod.title);
    // if (selectedPeriodType == PeriodType.Weeks) {        // weeks
    //   if (dpf.curDate == null || dpf.curDate.week() != startDate.week()) dpf.setDate(startDate);
    //   if (dpt.curDate == null || dpt.curDate.week() != endDate.week()) dpt.setDate(endDate);
    // } else {
    //   dpf.setDate(startDate, (selectedPeriodType < PeriodType.Days) ? null : start.title);
    //   dpt.setDate(endDate, (selectedPeriodType < PeriodType.Days) ? null : end.title);
    // }
     */
  }

  public hide() {
    this.setState({expanded: false});
    if (this.datepickerComponent) {
      this.datepickerComponent.datePicker.hide();
    }
  }

  private _handleClickDatePickerIcon = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({expanded: !this.state.expanded});
    // if (this.datepickerComponent) {
    //   this.datepickerComponent.datePicker.toggleVisibility();
    // }
  };

  private _handleClickTimePickerIcon = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // if (this.datepickerComponent) {
    //   this.datepickerComponent.timePicker.toggleVisibility();
    // }
  };

  private _onChange = (p: string) => {
    const m = moment(p + 'T00:00:00Z');
    return this.props.onChange(m);
  };

  private _isSelectable = (p: string) => {
    // currently only days
    const m = moment(p + 'T00:00:00Z');
    const isSelectable = this.props.isSelectable(m, 4);
    return isSelectable;
  }

  public render() {
    const {isVisible, isTimeVisible, description, selectedPeriod, allPeriods} = this.props;
    const {expanded} = this.state;
    // currently only days
    const p = DateUtils.makeDayFromDate(selectedPeriod.date);

    const startDate: Date = allPeriods[0].date;
    const endDate: Date = allPeriods[allPeriods.length - 1].date;
    const min = DateUtils.makeDayFromDate(startDate);
    const max = DateUtils.makeDayFromDate(endDate);

    const title = selectedPeriod.title;

    return (
      <section className="DateTimePicker" ref="container">

        <div style={{display: isVisible ? 'inline-block' : 'none'}} >

          {!!description &&
          <div className="DateTimePicker__Description">
            {description}
          </div>}

          <div className="DateTimePicker__DateInputContainer">
            <div className="input-group input-group-sm" style={{display: 'flex'}}>
              <input className="DateTimePicker__DateInput form-control"
                     id="dateInput"
                     autoComplete="off"
                     value={title}
                     onClick={this._handleClickDatePickerIcon}
                     readOnly={true}/>
              <BIIcon icon="date-picker-calendar"
                      onPress={this._handleClickDatePickerIcon}
                      className="DateTimePicker__DateIcon bi-icon dark input-group-addon"/>
            </div>

            {!!expanded &&
            <div id="datePicker" className="dtpkr" style={{display: 'block'}}>
              <DatePicker p={p} min={min} max={max} onChange={this._onChange} isSelectable={this._isSelectable}/>
            </div>}
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
