import React, { forwardRef, useState } from "react";
import "./styles.scss";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "../../../components/NewDatePicker/tools/constants";
import {
  getDayShortName,
  getYear,
} from "../../../components/NewDatePicker/tools/utils";
import ru from "date-fns/locale/ru";

type MonthPickerProps = {
  onChange?: (selectedDates: Date[]) => void;
  initialValue?: Date;
  minDate?: Date;
  maxDate?: Date;
};

const MonthPicker: React.FC<MonthPickerProps> = ({
  onChange,
  initialValue,
  minDate,
  maxDate,
}) => {
  const [selected, setSelected] = useState(initialValue || null);

  const changeHandler = (newValue) => {
    setSelected(newValue);
    onChange(newValue);
  };

  // @ts-ignore
  const CustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      // @ts-ignore
      <div className="custom-input" onClick={onClick} ref={ref}>
        <div className="custom-input__value">
          {value ? value : "Выберите месяц"}
        </div>
        <div className="custom-input__icon">
          <CalendarIcon />
        </div>
      </div>
    );
  });

  return (
    <DatePicker
      selected={selected}
      onChange={changeHandler}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="MM.yyyy"
      formatWeekDay={getDayShortName}
      calendarClassName="custom-calendar"
      customInput={<CustomInput />}
      showMonthYearPicker
      useShortMonthInDropdown={true}
      locale={ru}
      monthAriaLabelPrefix="ds"
      renderCustomHeader={({
        date,
        decreaseYear,
        increaseYear,
        prevYearButtonDisabled,
        nextYearButtonDisabled,
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
                disabled={nextYearButtonDisabled}
                className="custom-header__button"
              >
                {">"}
              </button>
            </div>
            <div
              className="custom-header__row"
              style={{ justifyContent: "center" }}
            >
              <span>Выбор месяца</span>
            </div>
          </div>
        );
      }}
    />
  );
};

export default MonthPicker;
