import * as React from 'react';
import cn from 'classnames';
import './ScheduleDlg.scss';
import {
  IPresentationsListModel,
  PresentationsListService,
} from 'bi-internal/services';
import { IPresentationModel } from './models';
import { MultiSelect } from './views/MultiSelect';
import range from 'lodash/range';
import { AuthenticationService } from 'bi-internal/core';
import { TMTasksService } from '../../services/tm/TMTasksService';
import { IRawTMTask } from '../../repositories/tm-repositories';
import { AlertsVC } from 'bi-internal/ui';
import { RemoveButton } from './PresentationElement';

const ArrowI = ({onClick, onMouseLeave}) =>
  <svg className="ArrowI" style={{width: '1.08rem', height: '1.08rem'}} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
       onClick={onClick} onMouseLeave={onMouseLeave}>
    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9.4V7" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4.59998H7.006" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;


const CalendarI = () =>
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.19995 7.20001H4.79995V8.80001H3.19995V7.20001ZM3.19995 10.4H4.79995V12H3.19995V10.4ZM6.39995 7.20001H7.99995V8.80001H6.39995V7.20001ZM6.39995 10.4H7.99995V12H6.39995V10.4ZM9.59995 7.20001H11.2V8.80001H9.59995V7.20001ZM9.59995 10.4H11.2V12H9.59995V10.4Z" fill="white"/>
    <path d="M1.6 16H12.8C13.6824 16 14.4 15.2824 14.4 14.4V3.2C14.4 2.3176 13.6824 1.6 12.8 1.6H11.2V0H9.6V1.6H4.8V0H3.2V1.6H1.6C0.7176 1.6 0 2.3176 0 3.2V14.4C0 15.2824 0.7176 16 1.6 16ZM12.8 4.8L12.8008 14.4H1.6V4.8H12.8Z" fill="white"/>
  </svg>;


interface ISchedulePickerProps {
  value: any[];
  onChange: (value: any[]) => any;
}


class ScheduleMonthDayPicker extends React.Component<ISchedulePickerProps> {
  public state: {expanded: boolean} = {expanded: false};

  private _toggle(newV) {
    let selected = {};
    this.props.value.forEach(v => selected[v] = true);
    selected[newV] = !selected[newV];
    // sort
    const value = range(1, 32).filter(v => selected[v]);
    console.log('WeekDays: ', value);
    this.props.onChange(value);
  }

  public render() {
    const {value} = this.props;
    const {expanded} = this.state;
    return (
      <div className={cn('ScheduleMonthDayPicker', {expanded})}>
        <h2 className={'ScheduleMonthDayPicker__title'} onClick={() => this.setState({expanded: !this.state.expanded})}>{value.length === 0 ? 'Укажите число' : value.join(', ')}</h2>
        <table>
          <tbody>
          {range(6).map(k =>
            <tr key={k}>
              {range(6).map((i, v) =>
                (v = 1 + 6 * k + i,
                <td key={v}
                    onClick={() => this._toggle(v)}
                    className={cn({active: value.indexOf(v) !== -1})}>
                  <span>{v <= 31 ? v : ''}</span>
                </td>))}
            </tr>)}
          </tbody>
        </table>
      </div>);
  }
}

class ScheduleWeekDayPicker extends React.Component<ISchedulePickerProps> {
  public state: {expanded: boolean} = {expanded: false};

  private _toggle(newV) {
    let selected = {};
    this.props.value.forEach(v => selected[v] = true);
    selected[newV] = !selected[newV];
    // sort
    const value = ['MON', 'WED', 'TUE', 'THU', 'FRI', 'SAT', 'SUN'].filter(v => selected[v]);
    console.log('WeekDays: ', value);
    this.props.onChange(value);
  }

  private _w2s = (w) => {
    return {MON: 'пн', WED: 'вт', TUE: 'ср', THU: 'чт', FRI: 'пт', SAT: 'сб', SUN: 'вс'}[w];
  };

  public render() {
    const {value} = this.props;
    const {expanded} = this.state;
    return (
      <div className={cn('ScheduleWeekDayPicker', {expanded})}>
        <h2 className={'ScheduleWeekDayPicker__title'} onClick={() => this.setState({expanded: !this.state.expanded})}>{value.length === 0 ? 'Укажите день' : value.map(this._w2s).join(', ')}</h2>
        <table>
          <tbody>
            <tr>
              <td className={cn({active: value.indexOf('MON') !== -1})} onClick={() => this._toggle('MON')}><span>пн</span></td>
              <td className={cn({active: value.indexOf('TUE') !== -1})} onClick={() => this._toggle('TUE')}><span>вт</span></td>
              <td className={cn({active: value.indexOf('WED') !== -1})} onClick={() => this._toggle('WED')}><span>ср</span></td>
              <td className={cn({active: value.indexOf('THU') !== -1})} onClick={() => this._toggle('THU')}><span>чт</span></td>
              <td className={cn({active: value.indexOf('FRI') !== -1})} onClick={() => this._toggle('FRI')}><span>пт</span></td>
              <td className={cn({active: value.indexOf('SAT') !== -1})} onClick={() => this._toggle('SAT')}><span>сб</span></td>
            </tr>
            <tr>
              <td className={cn({active: value.indexOf('SUN') !== -1})} onClick={() => this._toggle('SUN')}><span>вс</span></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>);
  }
}


function makeCron({periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute}): string {
  if (periodValue === 'daily') {
    return `0 ${scheduledMinute} ${scheduledHour} * * ?`;
  } else if (periodValue === 'monthly') {
    return `0 ${scheduledMinute} ${scheduledHour} ${scheduledMonthDays.join(',')} * ?`;
  } else {
    return `0 ${scheduledMinute} ${scheduledHour} ? * ${scheduledWeekDays.join(',')}`;
  }
}


function parseCron(cron: string): {periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute} {
  let [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cron.split(' ');
  let periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute;
  if (dayOfMonth === '*' && month === '*') {
    periodValue = 'daily';
  } else if (dayOfMonth === '?') {
    periodValue = 'weekly';
  } else {
    periodValue = 'monthly';
  }
  scheduledWeekDays = dayOfWeek === '?' || dayOfWeek === '' || dayOfWeek === '*' ? [] : dayOfWeek.split(',');
  scheduledMonthDays = dayOfMonth === '?' || dayOfMonth === '' || dayOfMonth === '*' ? [] : dayOfMonth.split(',').map(n => +n);
  scheduledHour = hours.match(/^\d+$/) ? +hours : hours;
  scheduledMinute = minutes.match(/^\d+$/) ? +minutes : minutes;

  return  {periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute};
}


interface IScheduleDlgProps {
  onClose: () => any;
}

export class ScheduleDlg extends React.Component<IScheduleDlgProps> {
  public state: {
    activeTask: IRawTMTask;
    presentations: IPresentationModel[];
    tasks: IRawTMTask[];
    attendingToRemoveTask: IRawTMTask;
  } = {
    activeTask: null,
    presentations: null,
    tasks: null,
    attendingToRemoveTask: null,
  };
  private _pls: PresentationsListService = null;
  private _tmts: TMTasksService = null;

  public constructor(props: IScheduleDlgProps) {
    super(props);
  }

  public componentDidMount(): void {
    this._tmts = new TMTasksService();
    this._tmts.subscribeUpdates(this._onSVCUpdated);
    this._pls = PresentationsListService.getInstance();
    this._pls.subscribeUpdatesAndNotify(this._onSVCUpdated);
  }

  public componentWillUnmount(): void {
    this._tmts.unsubscribe(this._onSVCUpdated);
    this._tmts = null;
    this._pls.unsubscribe(this._onSVCUpdated);
    this._pls = null;
  }

  private _onSVCUpdated = () => {
    const tmtm = this._tmts.getModel();
    const plm = this._pls.getModel();
    if (tmtm.loading || tmtm.error || plm.loading || plm.error) return;
    this.setState({
      tasks: tmtm.entities.filter(t => t.performer_id === 4),
      presentations: plm.presentations,
    });
  };

  private _onClickClose = () => {
    this.props.onClose();
  };

  private _onChangeSelectedPresentations = (presentationIds) => {
    let {activeTask} = this.state;
    const config = {
      ...activeTask.config,
      presentationIds: presentationIds,
    };
    activeTask = {...activeTask, config};
    this.setState({activeTask});
  };

  private _onCreateClick = () => {
    let activeTask = {
      title: '',
      performer_id: 4,
      user_id: AuthenticationService.getInstance().getModel().userId,
      is_enabled: 1,
      cron: makeCron({
        periodValue: 'daily',
        scheduledWeekDays: [],
        scheduledMonthDays: [],
        scheduledHour: 8,
        scheduledMinute: 0,
      }),
      config: {
        presentationIds: [],
        type: 'application/pdf',
        // type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      },
    };
    this.setState({activeTask});
  };

  private _onSaveClick = async () => {
    if (!this._isValidInput()) return;
    const {activeTask} = this.state;
    try {
      const res = await this._tmts.save(activeTask);
      AlertsVC.getInstance().pushSuccessAlert('Расписание успешно создано');
    } catch (err) {
      //
      AlertsVC.getInstance().pushDangerAlert('Расписание не удалось создать');
    }
    this.setState({activeTask: null});
  };

  private _onCancelClick = () => {
    // this.props.onClose();
    this.setState({activeTask: null});
  };

  private _isValidInput(): boolean {
    const {activeTask} = this.state;
    if (!activeTask) return false;
    if (!activeTask.title) return false;
    if (activeTask.config.presentationIds.length === 0) return false;
    const {periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute} = parseCron(activeTask.cron);
    if (periodValue === 'monthly' && scheduledMonthDays.length === 0) return false;
    if (periodValue === 'weekly' && scheduledWeekDays.length === 0) return false;
    if (typeof scheduledHour !== 'number') return false;
    if (typeof scheduledMinute !== 'number') return false;
    return true;
  }

  private _updateCron = (cronObj) => {
    let {activeTask} = this.state;
    const newCronObj = {
      ...parseCron(activeTask.cron),
      ...cronObj,
    };
    const cron = makeCron(newCronObj);
    console.log('NEW CRON: ', cron);
    activeTask = {...activeTask, cron};
    this.setState({activeTask});
  };

  private _renderCreating() {
    const {activeTask, presentations} = this.state;
    const {periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute} = parseCron(activeTask.cron);

    console.log('RENDER', {periodValue, scheduledWeekDays, scheduledMonthDays, scheduledHour, scheduledMinute});

    return (
      <div className="ScheduleDlg__Body">
        <div id="tooltip1" className="ScheduleDlg__Tooltip" style={{display: 'none'}}>
          При выборе значения "Все"<br/> параметры данного расписания<br/> будут установлены для всех<br/> созданных шаблонов.
        </div>

        <div id="tooltip2" className="ScheduleDlg__Tooltip" style={{display: 'none'}}>
          При указании времени отправки<br/> необходимо иметь в виду, что<br/> витрина показателей в <br/> соответствии с регламентом<br/> системы-источника обновится не <br/>ранее 9:00 МСК.
        </div>

        <div>
          <h3>Название расписания</h3>
          <input type="text"
                 className="ScheduleDlg__ScheduleName"
                 maxLength={60}
                 value={ activeTask.title }
                 onChange={ (event) => this.setState({ activeTask: {...activeTask, title: event.target.value} }) }/>
        </div>

        <div>
          <h3>Список шаблонов</h3>
          <div>
            <MultiSelect className="ScheduleDlg__Presentations"
                         onChange={ this._onChangeSelectedPresentations }
                         value={ activeTask.config.presentationIds }
                         multiple={ true }>
              { presentations.map(p =>
              <option key={ p.id } value={ p.id }>{ p.title }</option>) }
            </MultiSelect>
            <ArrowI onClick={() => $('#tooltip1').css({display: 'block'})}
                    onMouseLeave={() => $('#tooltip1').css({display: 'none'})}/>
          </div>
        </div>

        <div>
          <h3>Периодичность отправки</h3>
          <div>
            <div className="ScheduleDlg__PeriodSelectContainer">
              <select className="ScheduleDlg__PeriodSelect"
                      value={ periodValue }
                      onChange={ (event) => this._updateCron({periodValue: event.target.value}) }>
                <option value="daily">ежедневно</option>
                <option value="monthly">ежемесячно</option>
                <option value="weekly">еженедельно</option>
              </select>
            </div>

            <div className="ScheduleDlg__PeriodDropdownContainer">
              { periodValue === 'monthly' &&
              <ScheduleMonthDayPicker value={ scheduledMonthDays }
                                      onChange={ (scheduledMonthDays) => this._updateCron({scheduledMonthDays}) }/> }
              { periodValue === 'weekly' &&
              <ScheduleWeekDayPicker value={ scheduledWeekDays }
                                     onChange={ (scheduledWeekDays) => this._updateCron({scheduledWeekDays}) }/> }
            </div>
          </div>
        </div>

        <div>
          <h3>Время отправки</h3>
          <div>
            {/*<select className="ScheduleDlg__Hours"*/}
                    {/*value={ scheduledHour }*/}
                    {/*onChange={ (event) => this._updateCron({scheduledHour: event.target.value}) }>*/}
              {/*{ range(24).map(i => <option key={ i } value={ i }>{ i < 10 ? '0' + i : i }</option>) }*/}
            {/*</select>*/}
            <input type="number" min={0} max={23}
                   className="ScheduleDlg__Hours"
                   value={ String(scheduledHour) }
                   onInput={ (event: any) => { if (event.target.value === '')  event.target.value = ''; }}
                   onChange={ (event) => event.target.value.match(/^\d*$/) && +event.target.value < 24 && this._updateCron({scheduledHour: event.target.value}) }/>

            {/*<select className="ScheduleDlg__Minutes"*/}
                    {/*value={ scheduledMinute }*/}
                    {/*onChange={ (event) => this._updateCron({scheduledMinute: event.target.value}) }>*/}
              {/*{ range(60).map(i => <option key={ i } value={ i }>{ i < 10 ? '0' + i : i }</option>) }*/}
            {/*</select>*/}

            <input type="number" min={0} max={59}
                   className="ScheduleDlg__Minutes"
                   value={ String(scheduledMinute) }
                   onInput={ (event: any) => { if (event.target.value === '')  event.target.value = ''; }}
                   onChange={ (event) => event.target.value.match(/^\d*$/) && +event.target.value < 60 && this._updateCron({scheduledMinute: event.target.value}) }/>

            <ArrowI onClick={() => $('#tooltip2').css({display: 'block'})}
                    onMouseLeave={() => $('#tooltip2').css({display: 'none'})}/>
            <button className="ScheduleDlg__Save"
                    disabled={ !this._isValidInput() }
                    onClick={ this._onSaveClick }>Сохранить
            </button>
            <button className="ScheduleDlg__Cancel"
                    onClick={ this._onCancelClick }>Отмена
            </button>
          </div>
        </div>

        <div className="ScheduleDlg__Note">
          *Внимание<br/>
          Настройка расписания распространяется на рассылку по электронной почте и публикацию шаблонов
        </div>

      </div>);
  }

  public render() {
    const {activeTask, presentations, tasks, attendingToRemoveTask} = this.state;
    if (!tasks || !presentations) return null;

    return (
      <article className="ScheduleDlg">
        <svg className="ScheduleDlg__ArrowIcon" style={{width: '0.92rem', height: '0.69rem'}} viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#333333"/>
        </svg>

        <svg onClick={this._onClickClose} className="ScheduleDlg__CloseIcon" style={{width: '1.08rem', height: '1.08rem'}} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.88428 7.00067L13.5933 2.2903C13.7206 2.16741 13.822 2.02042 13.8918 1.8579C13.9617 1.69537 13.9984 1.52057 14 1.34369C14.0015 1.16682 13.9678 0.991403 13.9008 0.827691C13.8338 0.663978 13.7349 0.515244 13.6098 0.390168C13.4848 0.265092 13.336 0.166178 13.1723 0.099198C13.0086 0.0322179 12.8332 -0.00148672 12.6563 5.02969e-05C12.4794 0.00158732 12.3046 0.0383355 12.1421 0.108151C11.9796 0.177966 11.8326 0.279449 11.7097 0.40668L6.99933 5.11572L2.2903 0.40668C2.16741 0.279449 2.02042 0.177966 1.8579 0.108151C1.69537 0.0383355 1.52057 0.00158732 1.34369 5.02969e-05C1.16682 -0.00148672 0.991403 0.0322179 0.827691 0.099198C0.663978 0.166178 0.515244 0.265092 0.390168 0.390168C0.265092 0.515244 0.166178 0.663978 0.099198 0.827691C0.0322179 0.991403 -0.00148672 1.16682 5.02969e-05 1.34369C0.00158732 1.52057 0.0383355 1.69537 0.108151 1.8579C0.177966 2.02042 0.279449 2.16741 0.40668 2.2903L5.11572 6.99933L0.40668 11.7097C0.279449 11.8326 0.177966 11.9796 0.108151 12.1421C0.0383355 12.3046 0.00158732 12.4794 5.02969e-05 12.6563C-0.00148672 12.8332 0.0322179 13.0086 0.099198 13.1723C0.166178 13.336 0.265092 13.4848 0.390168 13.6098C0.515244 13.7349 0.663978 13.8338 0.827691 13.9008C0.991403 13.9678 1.16682 14.0015 1.34369 14C1.52057 13.9984 1.69537 13.9617 1.8579 13.8918C2.02042 13.822 2.16741 13.7206 2.2903 13.5933L6.99933 8.88428L11.7097 13.5933C11.8326 13.7206 11.9796 13.822 12.1421 13.8918C12.3046 13.9617 12.4794 13.9984 12.6563 14C12.8332 14.0015 13.0086 13.9678 13.1723 13.9008C13.336 13.8338 13.4848 13.7349 13.6098 13.6098C13.7349 13.4848 13.8338 13.336 13.9008 13.1723C13.9678 13.0086 14.0015 12.8332 14 12.6563C13.9984 12.4794 13.9617 12.3046 13.8918 12.1421C13.822 11.9796 13.7206 11.8326 13.5933 11.7097L8.88428 6.99933V7.00067Z" fill="#4E5C6B"/>
        </svg>

        {!activeTask &&
        <>
          <ul className="ScheduleDlg__TaskItems">
            {tasks.map(task =>
              <li key={task.id} className="ScheduleDlg__TaskItem" onClick={() => this.setState({activeTask: task})}>
                {task.title}
                <RemoveButton isAttendingToRemove={attendingToRemoveTask && attendingToRemoveTask.id === task.id}
                              onRemoveCancelPress={() => this.setState({attendingToRemoveTask: null})}
                              onRemoveApprovePress={() => this._tmts.remove(task.id)}
                              onRemovePress={() => this.setState({attendingToRemoveTask: attendingToRemoveTask === task ? null : task})}/>
              </li>)}
          </ul>
          <div className="ScheduleDlg__Create" onClick={this._onCreateClick}>
            <svg className="ScheduleDlg__CreateIcon" style={{width: '1.3rem', height: '1.3rem'}} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 17C3.8 17 0 13.2 0 8.5C0 3.8 3.8 0 8.5 0C13.2 0 17 3.8 17 8.5C17 13.2 13.2 17 8.5 17ZM8.5 1C4.35 1 1 4.35 1 8.5C1 12.65 4.35 16 8.5 16C12.65 16 16 12.65 16 8.5C16 4.35 12.65 1 8.5 1Z" fill="white"/>
              <path d="M4 8H13V9H4V8Z" fill="white"/>
              <path d="M8 4H9V13H8V4Z" fill="white"/>
            </svg>
            Создать новое расписание
          </div>
        </>}
        {!!!activeTask &&  <div className="ScheduleDlg__Note" id={'ScheduleDlgNote'}>
          *Внимание<br/>
          Настройка расписания распространяется на рассылку по электронной почте и публикацию шаблонов
        </div>}
        {!!activeTask && this._renderCreating()}
      </article>);
  }
}

