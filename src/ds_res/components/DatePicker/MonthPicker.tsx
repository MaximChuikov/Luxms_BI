import React, { forwardRef, useState } from "react";
import styles from "./DatePicker.module.scss"
import DatePicker from "react-datepicker";
import { CalendarIcon } from "./tools/constants";
import { getDayShortName, getYear } from "./tools/utils";
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
      <div className={styles.customInput} onClick={onClick} ref={ref}>
        <div className={styles.customInputValue}>
          {value ? value : "Выберите месяц"}
        </div>
        <div className={styles.customInputIcon}>
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
      calendarClassName={styles.customCalendar}
      wrapperClassName={styles.customWrapper}
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
          <div className={styles.customHeader}>
          <div className={styles.customHeaderRow}>
              <button
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
                className={styles.customHeaderButton}
              >
                {"<"}
              </button>
              <div className={styles.customHeaderSelect}>{getYear(date)}</div>
              <button
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
                className={styles.customHeaderButton}
              >
                {">"}
              </button>
            </div>
            <div
              className={styles.customHeaderRow}
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
