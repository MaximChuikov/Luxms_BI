import React, { forwardRef } from "react";
import "./NewDatePicker.scss";
import DatePicker from "react-datepicker";
import { CalendarIcon, daysShortNamesDict, months } from "./tools/constants";
import { getDayShortName, getMonthName, getYear } from "./tools/utils";

type DatePickerProps = {
  startDate: null | Date;
  endDate: null | Date;
  // onChange: (update: any) => void;
};

const onChange = (a) => {
  console.log("%c⧭", "color: #f200e2", a);
};

const NewDatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  // onChange,
}) => {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input" onClick={onClick} ref={ref}>
      <div className="custom-input__value">
        {value ? value : "Выберите дату"}
      </div>
      <div className="custom-input__icon">
        <CalendarIcon />
      </div>
    </div>
  ));

  return (
    <DatePicker
      // selectsRange={true}
      // startDate={startDate}
      // endDate={endDate}
      value={[new Date(), new Date().setMonth(3)]}
      // monthsShown={2}
      onChange={onChange}
      dateFormat="dd.MM.yyyy"
      // placeholderText="Выберите дату"
      formatWeekDay={getDayShortName}
      calendarClassName="custom-calendar"
      customInput={<CustomInput />}
      renderCustomHeader={({
        date,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        decreaseYear,
        increaseYear,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        prevYearButtonDisabled,
      }) => {
        return (
          <div className="custom-header">
            <div className="custom-header__row">
              <button
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
                className="custom-header__button"
              >
                {"<"}
              </button>
              <div className="custom-header__select">{getYear(date)}</div>
              <button
                onClick={increaseYear}
                disabled={nextMonthButtonDisabled}
                className="custom-header__button"
              >
                {">"}
              </button>
            </div>

            <div className="custom-header__row">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="custom-header__button"
              >
                {"<"}
              </button>
              <select
                value={getMonthName(date)}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
                className="custom-header__select"
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="custom-header__button"
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

export default NewDatePicker;
