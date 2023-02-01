import React, { forwardRef, useEffect, useState } from "react";
import styles from "./DatePicker.module.scss"
import DatePicker from "react-datepicker";
import { CalendarIcon, months } from "./tools/constants";
import { getDayShortName, getMonthName, getYear } from "./tools/utils";

type MultipleDatePickerProps = {
  onChange?: (selectedDates: Date[]) => void;
  initialValue?: Date[];
  minDate?: Date;
  maxDate?: Date;
};

const MultipleDatePicker: React.FC<MultipleDatePickerProps> = ({
  onChange,
  initialValue,
  minDate,
  maxDate,
}) => {
  // TODO: normalize date timestamp
  const [highlighted, setHighlighted] = useState<Date[]>(initialValue || []);
  const [selected, setSelected] = useState<Date>(initialValue?.[0] || null);

  // @ts-ignore
  const CustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      // @ts-ignore
      <div className={styles.customInput} onClick={onClick} ref={ref}>
        <div className={styles.customInputValue}>
          {value ? value : "Выберите дату"}
        </div>
        <div className={styles.customInputIcon}>
          <CalendarIcon />
        </div>
      </div>
    );
  });

  useEffect(() => {
    onChange(highlighted);
  }, [highlighted]);

  const changeHandlerRaw = (date: Date) => {
    const alreadyPickedIndex = highlighted.findIndex(
      (item) => item.getTime() === date.getTime()
    );
    if (alreadyPickedIndex > -1) {
      const newArr = [...highlighted];
      newArr.splice(alreadyPickedIndex, 1);
      setHighlighted(newArr);
      setSelected(newArr.at(-1) || null);
    } else {
      const newArr = [...highlighted, date].sort(function (a, b) {
        return a - b;
      });
      setHighlighted(newArr);
      setSelected(newArr.at(-1));
    }
  };

  return (
    <DatePicker
      highlightDates={highlighted}
      selected={selected}
      onSelect={changeHandlerRaw}
      shouldCloseOnSelect={false}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="dd.MM.yyyy"
      formatWeekDay={getDayShortName}
      calendarClassName={styles.customCalendar}
      wrapperClassName={styles.customWrapper}
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

            <div className={styles.customHeaderRow}>
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className={styles.customHeaderButton}
              >
                {"<"}
              </button>
              <select
                value={getMonthName(date)}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
                className={styles.customHeaderSelect}
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
                className={styles.customHeaderButton}
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

export default MultipleDatePicker;
