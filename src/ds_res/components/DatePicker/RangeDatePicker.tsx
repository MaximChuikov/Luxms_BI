import React, { forwardRef, useState } from "react";
import styles from "./DatePicker.module.scss"
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
    <div className={styles.customInput} onClick={onClick} ref={ref}>
      <div className={styles.customInputValue}>
        {value ? value : "Выберите дату"}
      </div>
      <div className={styles.customInputIcon}>
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
      calendarClassName={styles.customCalendar}
      wrapperClassName={styles.customWrapper}
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
          <div className={styles.customHeader}>
            <div className={styles.customHeaderRow}>
              <button
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
                className={styles.customHeaderButton}
                style={customHeaderCount === 1 ? { display: "none" } : null}
              >
                {"<"}
              </button>
              <div className={styles.customHeaderSelect}>{getYear(date)}</div>
              <button
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
                className={styles.customHeaderButton}
                style={customHeaderCount === 0 ? { display: "none" } : null}
              >
                {">"}
              </button>
            </div>

            <div className={styles.customHeaderRow}>
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className={styles.customHeaderButton}
                style={customHeaderCount === 1 ? { display: "none" } : null}
              >
                {"<"}
              </button>
              <div className={styles.customHeaderSelect}>
                {getMonthName(monthDate)}
              </div>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className={styles.customHeaderButton}
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
