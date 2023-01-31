import React, { useCallback, useEffect, useState } from "react";
import styles from "./App.module.scss";
import RangeDatePicker from "../ds_res/components/DatePicker/RangeDatePicker";
import MultipleDatePicker from "../ds_res/components/DatePicker/MultipleDatePicker";
import Context from "./src/context";
import MonthPicker from "../ds_res/components/DatePicker/MonthPicker";
import Table from "./src/components/Table/Table";
import { fetchTableData, fetchColumnUniqFilters } from "./src/api";
import Dropdown from "../ds_res/components/Dropdown";
import {
  MONTH_PICKER_ID,
  MULTIPLE_DATE_PICKER_ID,
  RANGE_DATE_PICKER_ID,
} from "./src/constants";
import { Column } from "../ds_res/utils/lookupFetch";

export type DatePickerVariants =
  | typeof MULTIPLE_DATE_PICKER_ID
  | typeof RANGE_DATE_PICKER_ID
  | typeof MONTH_PICKER_ID;

const datePickerSelectData: { id: DatePickerVariants; name: string }[] = [
  { id: MULTIPLE_DATE_PICKER_ID, name: "За сутки(выбор дат)" },
  { id: RANGE_DATE_PICKER_ID, name: "За сутки(выбор периода)" },
  { id: MONTH_PICKER_ID, name: "За месяц" },
];

const convertToTableData = (rows: string[][], columns: Column[]) => {
  const tableData = rows.map((row) => {
    let convertedRow = {};
    columns.forEach((column, i) => {
      convertedRow[column.name] = row[i];
    });
    return convertedRow;
  });
  return tableData;
};

function App() {
  const [rows, setRows] = useState([]);
  const [selectedDatePicker, setSelectedDatePicker] = useState(
    datePickerSelectData[0]
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedUserIpFilters, setSelectedUserIpFilters] = useState<string[]>(
    []
  );
  const [selectedSystemFilters, setSelectedSystemFilters] = useState<string[]>(
    []
  );
  const [selectedLoginFilters, setSelectedLoginFilters] = useState<string[]>(
    []
  );
  const [orderBy, setOrderBy] = useState("login");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const changeOrder = useCallback(
    (newOrderBy, newOrderDirection) => {
      setOrderBy(newOrderBy);
      setOrderDirection(newOrderDirection);
    },
    [orderBy, orderDirection]
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTableData({
        selectedDateVariant: selectedDatePicker.id,
        selectedDate,
        selectedUserIpFilters,
        selectedSystemFilters,
        selectedLoginFilters,
        orderBy,
        orderDirection,
      });
      if (data) {
        const tableData = convertToTableData(data.rows, data.columns);
        setRows(tableData);
      }
    };
    fetchData();
  }, [
    selectedDate,
    selectedDatePicker,
    selectedUserIpFilters,
    selectedSystemFilters,
    selectedLoginFilters,
    orderBy,
    orderDirection,
  ]);

  const [{ uniqIps, uniqSystems, uniqLogins }, setFilters] = useState({
    uniqIps: [],
    uniqSystems: [],
    uniqLogins: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTableData({});
      const [uniqIps, uniqSystems, uniqLogins] = await Promise.all([
        fetchColumnUniqFilters("user_ip"),
        fetchColumnUniqFilters("product"),
        fetchColumnUniqFilters("user_ident"),
      ]);
      setFilters({ uniqIps, uniqSystems, uniqLogins });
      const tableData = convertToTableData(data.rows, data.columns);
      setRows(tableData);
    };
    fetchData();
  }, []);

  const onDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const applyUserIpFilters = (filters) => {
    setSelectedUserIpFilters(filters);
  };
  const applySystemFilters = (filters) => {
    setSelectedSystemFilters(filters);
  };
  const applyLoginFilters = (filters) => {
    setSelectedLoginFilters(filters);
  };

  return (
    <Context.Provider
      value={{ applyUserIpFilters, applySystemFilters, applyLoginFilters }}
    >
      <div className={styles.wrapper}>
        <div className={styles.datePickerWrapper}>
          <Dropdown
            data={datePickerSelectData}
            onChange={(obj) => {
              setSelectedDate(null);
              setSelectedDatePicker(obj);
            }}
          />
          {selectedDatePicker.id === MULTIPLE_DATE_PICKER_ID ? (
            <MultipleDatePicker onChange={onDateChange} />
          ) : selectedDatePicker.id === RANGE_DATE_PICKER_ID ? (
            <RangeDatePicker onChange={onDateChange} />
          ) : (
            <MonthPicker onChange={onDateChange} />
          )}
        </div>

        <Table
          data={rows}
          filters={{ uniqIps, uniqSystems, uniqLogins }}
          selectedFilters={{
            selectedUserIpFilters,
            selectedSystemFilters,
            selectedLoginFilters,
          }}
          orderBy={orderBy}
          orderDirection={orderDirection}
          changeOrder={changeOrder}
        />
      </div>
    </Context.Provider>
  );
}

export default App;
