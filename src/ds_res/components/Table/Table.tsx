import React from 'react'
import style from './table.module.scss'

export interface ITableProps {
  headers: string[]
  tableData: string[][]
}

const SmallCard = ({ headers, tableData }: ITableProps) => {
  return (
    <div className={style.tableContainer}>
      <table className={style.table}>
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th key={index}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {row.map((column, ind) => (
                <td key={ind}>{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SmallCard
