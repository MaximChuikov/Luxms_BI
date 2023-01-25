import React, { useContext } from "react";
import styles from "./Table.module.scss";
import { useTable } from "react-table";
import Filter from "../Filter/Filter";
import Context from "../../context";

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

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

const TableComponent: React.FC<{
  data: any[];
  filters: { uniqIps: string[]; uniqSystems: string[]; uniqLogins: string[] };
}> = ({ data, filters }) => {
  const { applyUserIpFilters, applySystemFilters, applyLoginFilters } =
    useContext(Context);

  const columns = React.useMemo(
    () => [
      {
        Header: () => {
          return (
            <div className={styles.headerWrapper}>
              <div className={styles.headerTitle}>IP</div>
              <div className={styles.headerFilterWrapper}>
                <Filter
                  filters={filters.uniqIps}
                  onConfirm={applyUserIpFilters}
                />
              </div>
            </div>
          );
        },
        accessor: "user_ip",
      },
      {
        Header: () => {
          return (
            <div className={styles.headerWrapper}>
              <div className={styles.headerTitle}>Система</div>
              <div className={styles.headerFilterWrapper}>
                <Filter
                  filters={filters.uniqSystems}
                  onConfirm={applySystemFilters}
                />
              </div>
            </div>
          );
        },
        accessor: "product",
      },
      {
        Header: () => {
          return (
            <div className={styles.headerWrapper}>
              <div className={styles.headerTitle}>Логин</div>
              <div className={styles.headerFilterWrapper}>
                <Filter
                  filters={filters.uniqLogins}
                  onConfirm={applyLoginFilters}
                />
              </div>
            </div>
          );
        },
        accessor: "user_ident",
      },
      // {
      //   // Header: "Вход",
      //   Header: () => {
      //     return (
      //       <div>
      //         <div className={styles.headerTitle}>Вход</div>
      //         <div className={styles.headerFilterWrapper}>
      //           <Filter />
      //         </div>
      //       </div>
      //     );
      //   },
      //   accessor: "4",
      // },
      // {
      //   // Header: "Выход",
      //   Header: () => {
      //     return (
      //       <div>
      //         <div className={styles.headerTitle}>Выход</div>
      //         <div className={styles.headerFilterWrapper}>
      //           <Filter />
      //         </div>
      //       </div>
      //     );
      //   },
      //   accessor: "5",
      // },
      {
        Header: () => {
          return (
            <div className={styles.headerWrapper}>
              <div className={styles.headerTitle}>Результат</div>
              <div className={styles.headerFilterWrapper}></div>
            </div>
          );
        },
        accessor: "outcome",
      },
    ],
    [filters.uniqIps, filters.uniqLogins, filters.uniqSystems]
  );

  const memoData = React.useMemo(() => data, [data]);

  return (
    <div className={styles.table}>
      <Table columns={columns} data={memoData} />
    </div>
  );
};

export default TableComponent;
