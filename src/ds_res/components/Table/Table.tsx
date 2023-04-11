import React, { useEffect, useState } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import classNames from 'classnames'
import style from './table.module.scss'

export type ITableColumn = {
  value: string | number
  postfix?: string
  stats?: {
    isIncrease: boolean
    text: string
  }
}

export interface ITableProps {
  headers: string[]
  tableData: ITableColumn[][]
}

const Table = ({ headers, tableData }: ITableProps) => {
  /**
   * {(header index by which one do sort), (1 - descending, 0 - none, -1 - ascending)}
   */
  const [headerSort, setHeaderSort] = useState({ headerIndex: 0, sortDirection: 0 })
  const [sortedTableData, setSortedTableData] = useState([] as ITableColumn[][])
  useEffect(() => {
    function compareHandler(a: ITableColumn[], b: ITableColumn[]) {
      const hi = headerSort.headerIndex
      // без этого куска неравильно работает сортировка чисел, она работает как со строками
      // 140 > 20 = false берется только первый символ
      if (typeof a[hi].value === 'number' && typeof b[hi].value === 'number')
        return (Number(a[hi].value) - Number(b[hi].value)) * headerSort.sortDirection

      if (a[hi].value > b[hi].value) return headerSort.sortDirection
      if (a[hi].value < b[hi].value) return -1 * headerSort.sortDirection
      return 0
    }

    setSortedTableData(headerSort.sortDirection === 0 ? tableData : tableData.sort(compareHandler))
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
                <div>{h}</div>
                <div className={style.arrowsContainer}>
                  <ArrowDropUpIcon
                    className={classNames(style.upArrow, isActiveArrow(index, true) && style.activeArrow)}
                  />
                  <ArrowDropDownIcon
                    className={classNames(style.downArrow, isActiveArrow(index, false) && style.activeArrow)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTableData.map((row, index) => (
            <tr key={index}>
              {row.map((column, ind) => (
                <td key={ind}>
                  <div>
                    {column.value} {column.postfix}
                  </div>
                  {column.stats && (
                    <div className={style.stats}>
                      <ArrowUpwardIcon className={classNames(style.arrow, !column.stats.isIncrease && style.down)} />
                      <div>{column.stats.text}</div>
                    </div>
                  )}
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
