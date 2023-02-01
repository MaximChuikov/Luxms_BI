import React, { useContext, useMemo } from "react";
import styles from "./Table.module.scss";
import { format } from "date-fns";
import { useTable } from "react-table";
import Filter from "../Filter/Filter";
import Context from "../../context";
import SuccessCircle from "../../icons/successCircle";
import ErrorCircle from "../../icons/errorCircle";

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

const Header: React.FC<{
  columnId: string;
  columnName: string;
  filters?: string[];
  initialValues?: string[];
  orderBy: string;
  orderDirection: "asc" | "desc";
  onConfirm?: (selectedFilters: string[]) => void;
  onSort: (orderBy: string, orderDirection: "asc" | "desc") => void;
  noFilter?: boolean;
}> = ({
  columnId,
  columnName,
  filters,
  initialValues,
  orderBy,
  orderDirection,
  onConfirm,
  onSort,
  noFilter,
}) => {
  const isSorted = useMemo(() => {
    return orderBy === columnId;
  }, [orderBy, columnId, orderDirection]);
  const sortHandler = () => {
    if (isSorted) {
      if (orderDirection === "asc") {
        onSort(columnId, "desc");
      }
      if (orderDirection === "desc") {
        onSort("login", "asc");
      }
    } else {
      onSort(columnId, "asc");
    }
  };
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerTitle} onClick={sortHandler}>
        {isSorted ? (orderDirection === "asc" ? "▼ " : "▲ ") : ""}
        {columnName}
      </div>
      <div className={styles.headerFilterWrapper}>
        {!noFilter && (
          <Filter
            filters={filters}
            initialValues={initialValues}
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
};

const TableComponent: React.FC<{
  data: any[];
  filters: { uniqIps: string[]; uniqSystems: string[]; uniqLogins: string[] };
  selectedFilters: {
    selectedUserIpFilters: string[];
    selectedSystemFilters: string[];
    selectedLoginFilters: string[];
  };
  orderBy: string;
  orderDirection: "asc" | "desc";
  changeOrder: (newOrderBy: string, newOrderDirection: string) => void;
}> = ({
  data,
  filters,
  selectedFilters,
  orderBy,
  orderDirection,
  changeOrder,
}) => {
  const { applyUserIpFilters, applySystemFilters, applyLoginFilters } =
    useContext(Context);

  const columns = React.useMemo(
    () => [
      {
        Header: () => {
          return (
            <Header
              columnId={"user_ip"}
              columnName={"IP"}
              filters={filters.uniqIps}
              initialValues={selectedFilters.selectedUserIpFilters}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onConfirm={applyUserIpFilters}
              onSort={changeOrder}
            />
          );
        },
        accessor: "user_ip",
      },
      {
        Header: () => {
          return (
            <Header
              columnId={"product"}
              columnName={"Система"}
              filters={filters.uniqSystems}
              initialValues={selectedFilters.selectedSystemFilters}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onConfirm={applySystemFilters}
              onSort={changeOrder}
            />
          );
        },
        accessor: "product",
      },
      {
        Header: () => {
          return (
            <Header
              columnId={"user_ident"}
              columnName={"Логин"}
              filters={filters.uniqLogins}
              initialValues={selectedFilters.selectedLoginFilters}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onConfirm={applyLoginFilters}
              onSort={changeOrder}
            />
          );
        },
        accessor: "user_ident",
      },
      {
        Header: () => {
          return (
            <Header
              columnId={"login"}
              columnName={"Вход"}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onSort={changeOrder}
              noFilter
            />
          );
        },
        accessor: "login",
        Cell: ({ value }) => {
          const date = new Date(value);
          const firstRow = format(date, "hh:mm:ss");
          const secondRow = format(date, "dd.MM.yyyy");
          return (
            <div className={styles.dateCellWrapper}>
              <span>{firstRow}</span>
              <br />
              <span>{secondRow}</span>
            </div>
          );
        },
      },
      {
        Header: () => {
          return (
            <Header
              columnId={"logout"}
              columnName={"Выход"}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onSort={changeOrder}
              noFilter
            />
          );
        },
        accessor: "logout",
        Cell: ({ value }) => {
          const date = new Date(value);
          const firstRow = format(date, "hh:mm:ss");
          const secondRow = format(date, "dd.MM.yyyy");
          return (
            <div className={styles.dateCellWrapper}>
              <span>{firstRow}</span>
              <br />
              <span>{secondRow}</span>
            </div>
          );
        },
      },
      {
        Header: () => {
          return (
            <Header
              columnId={"outcome"}
              columnName={"Результат"}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onSort={changeOrder}
              noFilter
            />
          );
        },
        Cell: ({ value }) => {
          return value === "success" ? (
            <SuccessCircle />
          ) : value === "failure" ? (
            <ErrorCircle />
          ) : (
            value
          );
        },
        accessor: "outcome",
      },
    ],
    [
      filters.uniqIps,
      filters.uniqLogins,
      filters.uniqSystems,
      selectedFilters.selectedUserIpFilters,
      selectedFilters.selectedSystemFilters,
      selectedFilters.selectedLoginFilters,
      orderBy,
      orderDirection,
    ]
  );

  const memoData = React.useMemo(() => data, [data]);

  return (
    <div className={styles.table}>
      <Table columns={columns} data={memoData} />
    </div>
  );
};

export default TableComponent;
