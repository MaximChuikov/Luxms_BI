import React, { useEffect, useState } from "react";
import RangeDatePicker from "../components/NewDatePicker/RangeDatePicker";
import MultipleDatePicker from "../components/NewDatePicker/MultipleDatePicker";
import Context from "./src/context";
import MonthPicker from "../components/NewDatePicker/MonthPicker";
import Table from "./src/components/Table/Table";

export const HEADERS_FOR_FETCH = {
  accept: "application/json, text/javascript, */*; q=0.01",
  "accept-language": "en-US,en;q=0.9,ru;q=0.8",
  "cache-control": "no-cache",
  "content-type": "application/json",
  pragma: "no-cache",
  "x-requested-with": "XMLHttpRequest",
};

export async function getData(lookupId: number, data: any = {}) {
  const body = {
    lookupId: lookupId,
    // limit: 100,
    // offset: 0,
    ...data,
  };

  try {
    // user_ip, product,
    // SELECT vendor, product, product_version, event_type, event_name, event_severity, user_ip, service_host, user_ident, msg, info, outcome, created
    // FROM audit.events;
    const response = await fetch(`../../../api/lookup/ds_127/${lookupId}`, {
      credentials: "include",
      headers: HEADERS_FOR_FETCH,
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
    });
    return await response.json();
  } catch (error) {
    console.log(`fetch data ${lookupId} is not load`);
  }
}

function App() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(2);
      console.log("%c⧭", "color: #00e600", data);
      setRows(data.rows);
      setColumns(data.columns);
    };
    fetchData();
  }, []);

  const onChange = (newValue) => {
    console.log("%c⧭", "color: #e50000", newValue);
  };

  return (
    <Context.Provider value={{}}>
      <div className="wrapper">
        <h1>TEST</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <RangeDatePicker onChange={onChange} />
          <MultipleDatePicker onChange={onChange} />
          <MonthPicker />
        </div>

        <Table />
      </div>
    </Context.Provider>
  );
}

export default App;
