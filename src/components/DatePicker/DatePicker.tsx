import React from "react";
import cn from "classnames";
import {DateUtils} from "./DateUtils";
import './DatePicker.scss';


const PADDING = 4;
const SIZE = 26;


const TRIANGLE_SIZE = SIZE * 0.618;
const TRIANGLE_HEIGHT = TRIANGLE_SIZE * Math.sqrt(3) / 2;


interface IButtonProps {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: any;
  onClick?: () => any;
  disabled?: boolean;
  className?: string;
}

const Button = ({x, y, w, h, children, onClick, disabled, className}: IButtonProps) => (
  <g className={cn('DatePicker__Button', className, {disabled})} style={{transform: `translate(${x}px, ${y}px)`}}>
    <rect className="DatePicker__ButtonBackground" x="0" y="0" width={w} height={h}/>
    {(typeof children === 'string') || (typeof children === 'number') ?
      <text className="DatePicker__ButtonTitle"
            x={w / 2} y={h / 2 + 1}
            textAnchor="middle" dominantBaseline="middle" fill="white">{children}</text> :
      children}
    {!!onClick && disabled !== true &&
    <rect className="DatePicker__ButtonTarget"
          x="0" y="0" width={w} height={h}
          onClick={onClick}/>}
  </g>);


interface IHorizontalPickerProps {
  title: string;
  x: number;
  y: number;
  className?: string;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  onClick?: () => any;
  onClickLeft?: () => any;
  onClickRight?: () => any
}

const HorizontalPicker = ({title, x, y, className, leftDisabled, rightDisabled, onClick, onClickLeft, onClickRight}: IHorizontalPickerProps) => (
  <g className={cn('DatePicker__HorizontalPicker', className)}  style={{transform: `translate(${x}px, ${y}px)`}}>
    <Button x={0} y={0} w={SIZE - 1} h={SIZE - 1} disabled={leftDisabled} onClick={onClickLeft}>
      {leftDisabled !== true &&
      <polygon className="DatePicker__IconTriangle"
               points={`${SIZE / 2 - TRIANGLE_HEIGHT * 2 / 3},${SIZE / 2}
                        ${SIZE / 2 + TRIANGLE_HEIGHT / 3},${SIZE / 2 - TRIANGLE_SIZE / 2}
                        ${SIZE / 2 + TRIANGLE_HEIGHT / 3},${SIZE / 2 + TRIANGLE_SIZE / 2}`} />}
    </Button>
    <Button x={SIZE} y={0} w={SIZE * 5 - 1} h={SIZE - 1} onClick={onClick}>{title}</Button>
    <Button x={SIZE * 6} y={0} w={SIZE - 1} h={SIZE - 1} disabled={rightDisabled} onClick={onClickRight}>
      {rightDisabled !== true &&
      <polygon className="DatePicker__IconTriangle"
               points={`${SIZE / 2 + TRIANGLE_HEIGHT * 2 / 3},${SIZE / 2}
                        ${SIZE / 2 - TRIANGLE_HEIGHT / 3},${SIZE/2 - TRIANGLE_SIZE / 2}
                        ${SIZE / 2 - TRIANGLE_HEIGHT / 3},${SIZE/2 + TRIANGLE_SIZE / 2}`} />}
    </Button>
  </g>);


const DAY_OF_WEEK_TITLES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTH_TITLES = ['', 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];


export interface IDatePickerProps {
  p: string;
  min?: string;
  max?: string;
  isSelectable?: (p: string) => boolean;
  onChange?: (p: string) => any;
}

interface IDatePickerState {
  selectedYear: number;
  selectedMonth: number;
}

export class DatePicker extends React.Component<IDatePickerProps> {
  public state: IDatePickerState;

  public constructor(props: IDatePickerProps) {
    super(props);
    const {p} = props;
    const {year, month} = DateUtils.split(p);
    this.state = {
      selectedYear: year,
      selectedMonth: month,
    };
  }

  private _select(newSelected: Partial<IDatePickerState>) {
    const s: IDatePickerState = {
      ...this.state,
      ...newSelected
    };
    const {min, max} = this.props;
    if (min && DateUtils.makeMonth(s.selectedYear, s.selectedMonth) < min) {
      s.selectedYear = +min.slice(0, 4);
      s.selectedMonth = +min.slice(5, 7);
    }
    if (max && DateUtils.makeMonth(s.selectedYear, s.selectedMonth) > max) {
      s.selectedYear = +max.slice(0, 4);
      s.selectedMonth = +max.slice(5, 7);
    }
    this.setState(s);
  }

  private _decYear = () => this._select({selectedYear: this.state.selectedYear - 1});
  private _incYear = () => this._select({selectedYear: this.state.selectedYear + 1});
  private _decMonth = () => {
    let {selectedYear, selectedMonth} = this.state;
    selectedMonth --;
    if (selectedMonth === 0) { selectedYear --; selectedMonth = 12}
    this._select({selectedYear, selectedMonth});
  };
  private _incMonth = () => {
    let {selectedYear, selectedMonth} = this.state;
    selectedMonth ++;
    if (selectedMonth === 13) { selectedYear ++; selectedMonth = 1}
    this._select({selectedYear, selectedMonth});
  }

  private _onApply = (p?: string) => {
    if (!p) {
      const {selectedYear, selectedMonth} = this.state;
      const {day} = DateUtils.split(this.props.p);
      p = DateUtils.make({
        year: selectedYear,
        month: selectedMonth,
        day,
      });
    }
    if (this.props.onChange) {
      this.props.onChange(p);
    }
  }

  private _isSelectable(p: string) {
    const {min, max, isSelectable} = this.props;
    // SKIMN: крайние периоды не всегда имеют возможность быть щелкнутыми, зависит от метрики привязанной к дэшборду (932)
    // if (min && p === min) return true;
    // if (max && p === max) return true;
    if (min && p < min) return false;
    if (max && max < p) return false;
    if (isSelectable) return isSelectable(p);
    return true;
  }

  public render() {
    const {p, min, max} = this.props;
    const {selectedYear, selectedMonth} = this.state;
    const selected = DateUtils.makeMonth(selectedYear, selectedMonth);

    const isYear = DateUtils.isYear(p);
    const isQuarter = DateUtils.isQuarter(p);
    const isMonth = DateUtils.isMonth(p);
    const isWeek = DateUtils.isWeek(p);
    const isDay = DateUtils.isDay(p);

    if (!isYear && !isQuarter && !isMonth && !isWeek && !isDay) {
      throw new Error('Undefined period: ' + p);
    }

    const hasDayPicker = isDay || isWeek;
    const hasMonthPicker = isMonth || hasDayPicker;
    const hasQuarterPicker = isQuarter;
    const hasYearPicker = true;

    const weeks = DateUtils.getWeeksOfMonth(selectedYear, selectedMonth);

    const width = PADDING + (7 * SIZE - 1) + PADDING;
    const height = PADDING + ((+hasYearPicker) + (+hasQuarterPicker) + (+hasMonthPicker) + (+hasDayPicker) * (1 + weeks.length)) * SIZE - 1 + PADDING;

    return (
      <svg version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           baseProfile="full"
           viewBox={`0 0 ${width} ${height}`}
           className="DatePickerSvg">

        <rect className="DatePicker__Background" width="100%" height="100%" />

        <HorizontalPicker title={String(selectedYear)}
                          x={PADDING} y={PADDING}
                          leftDisabled={!!min && DateUtils.make({year: selectedYear - 1}) < min.slice(0, 4)}
                          rightDisabled={!!max && DateUtils.make({year: selectedYear + 1}) > max.slice(0, 4)}
                          className="DatePicker__YearPicker"
                          onClick={() => this._onApply()}
                          onClickLeft={this._decYear}
                          onClickRight={this._incYear}/>

        <HorizontalPicker title={MONTH_TITLES[selectedMonth]}
                          x={PADDING} y={30}
                          leftDisabled={!!min && DateUtils.addMonths(selected, -1) < min.slice(0, 7)}
                          rightDisabled={!!max && DateUtils.addMonths(selected, 1) > max.slice(0, 7)}
                          className="DatePicker__MonthPicker"
                          onClick={() => this._onApply()}
                          onClickLeft={this._decMonth}
                          onClickRight={this._incMonth}/>

        {hasDayPicker &&
        <g className="DatePicker__DayPicker" style={{transform: `translate(${PADDING}px, 54px)`}}>
          <g className="DatePicker__DayOfWeekTitles">
            {DAY_OF_WEEK_TITLES.map((day, dayIdx) =>
              <text className="DatePicker__DayOfWeekTitle" key={day} x={SIZE * (dayIdx + 1 / 2)} y={SIZE / 2 + 1} fontSize="16" textAnchor="middle" dominantBaseline="middle" fill="white">{day}</text>)}
          </g>

          {weeks.map((week, weekIdx) =>
            <g className="DatePicker__Week" style={{transform: `translate(0, ${(weekIdx + 1) * SIZE}px)`}} key={String(week)}>
              {week.map((day, dayIdx) =>
                day &&
                <Button key={day || dayIdx}
                        className={cn('DatePicker__Day', {active: day === p})}
                        disabled={!this._isSelectable(day)}
                        x={dayIdx * SIZE} y={0}
                        w={SIZE - 1} h={SIZE - 1}
                        onClick={() => this._onApply(day)}>{+day.slice(8, 10)}</Button>)}
            </g>)}

        </g>}
      </svg>);
  }
}
