import React, { forwardRef, useEffect, useState } from "react";
import "./NewDatePicker.scss";
import DatePicker from "react-datepicker";
import { CalendarIcon, months } from "./tools/constants";
import { getDayShortName, getMonthName, getYear } from "./tools/utils";

type DatePickerProps = {
  onChange?: (selectedDates: Date[]) => void;
  initialValue?: Date[];
  minDate?: Date;
  maxDate?: Date;
};

const MultipleDates: React.FC<DatePickerProps> = ({
  onChange,
  initialValue,
  minDate,
  maxDate,
}) => {
  // TODO: normalize date timestamp
  const [highlighted, setHighlighted] = useState<Date[]>(initialValue || []);
  const [selected, setSelected] = useState<Date>(highlighted[0] || null);

  const changeHandler = (selectedDate: Date) => {
    let newHighlightedValue;
    if (highlighted.find((date) => date.getTime() === selectedDate.getTime())) {
      newHighlightedValue = [
        ...highlighted.filter(
          (date) => date.getTime() !== selectedDate.getTime()
        ),
      ];
    } else {
      newHighlightedValue = [...highlighted, selectedDate];
      setSelected(selectedDate);
    }

    setHighlighted(newHighlightedValue);
    onChange(newHighlightedValue);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="custom-input" onClick={onClick} ref={ref}>
        <div className="custom-input__value">
          {value ? value : "Выберите дату"}
        </div>
        <div className="custom-input__icon">
          <CalendarIcon />
        </div>
      </div>
    );
  });

  const changeHandlerRaw = (date: Date) => {
    if (date?.getTime() === selected?.getTime()) {
      if (highlighted?.[0]?.getTime() === selected?.getTime()) {
        if (highlighted.length === 1) {
          setSelected(null);
          setHighlighted([]);
        } else {
          setSelected(highlighted[1]);
          setHighlighted(
            highlighted.filter((d) => d.getTime() !== date.getTime())
          );
        }
      } else {
        setSelected(highlighted[0]);
        setHighlighted(
          highlighted.filter((d) => d.getTime() !== date.getTime())
        );
      }
    }
  };

  return (
    <DatePicker
      highlightDates={highlighted}
      selected={selected}
      onChange={changeHandler}
      onSelect={changeHandlerRaw}
      shouldCloseOnSelect={false}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="dd.MM.yyyy"
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

export default MultipleDates;
