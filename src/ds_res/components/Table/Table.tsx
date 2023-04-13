import React, { useEffect, useState } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import classNames from 'classnames'
import ArrowDropdown from '../Icons/ArrowDropdown'
import style from './table.module.scss'

export type ITableColumn = {
  value: string | number
  postfix?: string
  stats?: {
    isIncrease: boolean
    text: string
  }
}

export interface ITableRow {
  isIncrease: boolean
  columns: ITableColumn[]
}

export interface ITableProps {
  headers: string[]
  tableData: ITableRow[]
}

const Table = ({ headers, tableData }: ITableProps) => {
  /**
   * {(header index by which one do sort), (1 - descending, 0 - none, -1 - ascending)}
   */
  const [headerSort, setHeaderSort] = useState({ headerIndex: 0, sortDirection: 0 })
  const [sortedTableData, setSortedTableData] = useState([] as ITableRow[])
  useEffect(() => {
    function compareHandler(a: ITableRow, b: ITableRow) {
      const hi = headerSort.headerIndex
      const aV = a.columns[hi].value
      const bV = b.columns[hi].value
      // без этого кода неравильно работает сортировка чисел, она работает как со строками
      // 140 > 20 = false берется только первый символ
      if (typeof aV === 'number' && typeof bV === 'number') return Number(aV) - Number(bV) * headerSort.sortDirection

      if (aV > bV) return headerSort.sortDirection
      if (aV < bV) return -1 * headerSort.sortDirection
      return 0
    }

    setSortedTableData(headerSort.sortDirection === 0 ? tableData : [...tableData].sort(compareHandler))
  }, [headerSort])

  function headerClickHandler(headerInd: number) {
    if (headerInd === headerSort.headerIndex) {
      if (headerSort.sortDirection > 0) {
        setHeaderSort({ headerIndex: headerInd, sortDirection: -1 })
        return
      }
      if (headerSort.sortDirection < 0) {
        setHeaderSort({ headerIndex: headerInd, sortDirection: 0 })
        return
      }
    }
    setHeaderSort({ headerIndex: headerInd, sortDirection: 1 })
  }
  function isActiveArrow(headerInd: number, isUp: boolean) {
    return headerSort.headerIndex === headerInd && (isUp ? headerSort.sortDirection < 0 : headerSort.sortDirection > 0)
  }

  return (
    <div className={style.tableContainer}>
      <table className={style.table}>
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th key={index} onClick={() => headerClickHandler(index)}>
                <div>
                  {h}
                  <div className={style.arrowsContainer}>
                    <ArrowDropdown
                      className={classNames(style.upArrow, isActiveArrow(index, true) && style.activeArrow)}
                    />
                    <ArrowDropdown
                      className={classNames(style.downArrow, isActiveArrow(index, false) && style.activeArrow)}
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTableData.map((row, index) => (
            <tr key={index} className={!row.isIncrease && style.redRow}>
              {row.columns.map((column, ind) => (
                <td key={ind}>
                  <div>
                    <div>
                      {column.value} {column.postfix}
                    </div>
                    {column.stats && (
                      <div className={style.stats}>
                        <ArrowUpwardIcon
                          className={classNames(style.arrow, !column.stats.isIncrease && style.redArr)}
                        />
                        <div>{column.stats.text}</div>
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
