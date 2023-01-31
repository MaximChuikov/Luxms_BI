import React, { forwardRef, useState } from "react";
import "./styles.scss";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "./tools/constants";
import { getDayShortName, getMonthName, getYear } from "./tools/utils";

type RangeDatePickerProps = {
  onChange?: (newValue: [Date, Date]) => void;
  initialValue?: [Date, Date | null];
  minDate?: Date;
  maxDate?: Date;
};

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  onChange,
  initialValue,
  minDate,
  maxDate,
}) => {
  const [dateRange, setDateRange] = useState(initialValue || [null, null]);
  const [startDate, endDate] = dateRange;

  // @ts-ignore
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    // @ts-ignore
    <div className="custom-input" onClick={onClick} ref={ref}>
      <div className="custom-input__value">
        {value ? value : "Выберите дату"}
      </div>
      <div className="custom-input__icon">
        <CalendarIcon />
      </div>
    </div>
  ));

  const changeHandler = (newValue) => {
    setDateRange(newValue);
    onChange(newValue);
  };

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      monthsShown={2}
      onChange={changeHandler}
      dateFormat="dd.MM.yyyy"
      minDate={minDate}
      maxDate={maxDate}
      formatWeekDay={getDayShortName}
      calendarClassName="custom-calendar"
      wrapperClassName="custom-wrapper"
      customInput={<CustomInput />}
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        decreaseYear,
        increaseYear,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        prevYearButtonDisabled,
        nextYearButtonDisabled,
        monthDate,
        customHeaderCount,
      }) => {
        return (
          <div className="custom-header">
            <div className="custom-header__row">
              <button
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
                className="custom-header__button"
                style={customHeaderCount === 1 ? { display: "none" } : null}
              >
                {"<"}
              </button>
              <div className="custom-header__select">{getYear(date)}</div>
              <button
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
                className="custom-header__button"
                style={customHeaderCount === 0 ? { display: "none" } : null}
              >
                {">"}
              </button>
            </div>

            <div className="custom-header__row">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="custom-header__button"
                style={customHeaderCount === 1 ? { display: "none" } : null}
              >
                {"<"}
              </button>
              <div className="custom-header__select">
                {getMonthName(monthDate)}
              </div>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="custom-header__button"
                style={customHeaderCount === 0 ? { display: "none" } : null}
              >
                {">"}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
};

export default RangeDatePicker;
