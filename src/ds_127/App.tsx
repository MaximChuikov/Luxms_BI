import React, { useEffect, useState } from "react";
import RangeDatePicker from "../ds_res/components/DatePicker/RangeDatePicker";
import MultipleDatePicker from "../ds_res/components/DatePicker/MultipleDatePicker";
import Context from "./src/context";
import MonthPicker from "../ds_res/components/DatePicker/MonthPicker";
import Table from "./src/components/Table/Table";
import { fetchTableData, fetchColumnUniqFilters } from "./src/api";
import Dropdown from "../ds_res/components/Dropdown";

const MULTIPLE_DATE_PICKER_ID = "multipleDatePicker";
const RANGE_DATE_PICKER_ID = "rangeDatePicker";
const MONTH_PICKER_ID = "monthPicker";

const datePickerSelectData = [
  { id: MULTIPLE_DATE_PICKER_ID, name: "За сутки(выбор дат)" },
  { id: RANGE_DATE_PICKER_ID, name: "За сутки(выбор периода)" },
  { id: MONTH_PICKER_ID, name: "За месяц" },
];

const convertToTableData = (rows: string[][], columns) => {
  // const convertToTableData = (rows: string[][], columns: Column[]) => {
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [{ uniqIps, uniqSystems, uniqLogins }, setFilters] = useState({
    uniqIps: [],
    uniqSystems: [],
    uniqLogins: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTableData();
      const [uniqIps, uniqSystems, uniqLogins] = await Promise.all([
        fetchColumnUniqFilters("user_ip"),
        fetchColumnUniqFilters("product"),
        fetchColumnUniqFilters("user_ident"),
      ]);
      setFilters({ uniqIps, uniqSystems, uniqLogins });
      console.log("%c⧭", "color: #40fff2", [uniqIps, uniqSystems, uniqLogins]);
      const tableData = convertToTableData(data.rows, data.columns);
      setRows(tableData);
      // setColumns(data.columns);
    };
    fetchData();
  }, []);

  const onDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const applyUserIpFilters = (filters) => {
    console.log("%c⧭", "color: #c800ff", "context", filters);
  };
  const applySystemFilters = (filters) => {
    console.log("%c⧭", "color: #c800ff", "context", filters);
  };
  const applyLoginFilters = (filters) => {
    console.log("%c⧭", "color: #c800ff", "context", filters);
  };

  return (
    <Context.Provider
      value={{ applyUserIpFilters, applySystemFilters, applyLoginFilters }}
    >
      <div className="wrapper">
        <div style={{ display: "flex", gap: "20px" }}>
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

        <Table data={rows} filters={{ uniqIps, uniqSystems, uniqLogins }} />
      </div>
    </Context.Provider>
  );
}

export default App;
