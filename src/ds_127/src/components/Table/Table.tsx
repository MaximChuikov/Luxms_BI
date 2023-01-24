import React from "react";
import styles from "./Table.module.scss";
import { useTable } from "react-table";
import Filter from "../Filter/Filter";

const data = [
  {
    1: "chess",
    2: "patch",
    3: 19,
    4: 64,
    5: 19,
    6: "complicated",
  },
  {
    1: "chess",
    2: "patch",
    3: 19,
    4: 64,
    5: 19,
    6: "complicated",
  },
  {
    1: "chess",
    2: "patch",
    3: 19,
    4: 64,
    5: 19,
    6: "complicated",
  },
];

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        // Header: "IP",
        Header: () => {
          return (
            <div>
              <div className={styles.headerTitle}>IP</div>
              <div className={styles.headerFilterWrapper}>
                <Filter />
              </div>
            </div>
          );
        },
        accessor: "1",
      },
      {
        Header: "Система",
        accessor: "2",
      },
      {
        Header: "Логин",
        accessor: "3",
      },
      {
        Header: "Вход",
        accessor: "4",
      },
      {
        Header: "Выход",
        accessor: "5",
      },
      {
        Header: "Результат",
        accessor: "6",
      },
    ],
    []
  );

  const memoData = React.useMemo(() => data, []);

  return (
    <div className={styles.table}>
      <Table columns={columns} data={memoData} />
    </div>
  );
}

export default App;
