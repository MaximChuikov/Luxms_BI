import React from 'react'
import { Column, useTable } from 'react-table'
import hash from 'object-hash'

type TTable<T> = {
  columns: Column<Partial<T>>[]
  data: T[]
  withTHead: boolean
  onClick: (arg: React.MouseEvent<HTMLTableCellElement>) => void
}

export const Table = <T,>({ columns, data, withTHead, onClick }: TTable<T>) => {
  const { getTableBodyProps, headerGroups, getTableProps, rows, prepareRow } = useTable({
    columns,
    data
  })

  const handleOnClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.stopPropagation()
    onClick(event)
  }

  return (
    <table {...getTableProps()}>
      {withTHead ? (
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={hash(headerGroup)}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={hash(column)}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      ) : null}
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} key={hash(row)}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} onClick={handleOnClick} key={hash(cell)}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
