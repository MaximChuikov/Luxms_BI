import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import classNames from 'classnames'
import { getColor } from '../../../utils/colors'
import style from './table.module.scss'

export interface IColoredTableData {
  diagram: {
    title: string
    value: number
    stats: {
      isIncrease: boolean
      text: string
    }
  }[]
  valuePostfix: string
}

const ColoredTable = ({ diagram, valuePostfix }: IColoredTableData) => {
  if (diagram.length === 0) return <></>

  return (
    <div className={style.tableContainer}>
      {diagram.map((row, index) => (
        <div className={style.tableRow} key={index} style={{ borderLeft: `6px solid ${getColor(index)}` }}>
          <div>{row.title}</div>
          <div className={style.value}>{`${row.value} ${valuePostfix}`}</div>
          <div className={style.stats}>
            <ArrowUpwardIcon className={classNames(style.arrow, !row.stats.isIncrease && style.redArr)} />
            {`${row.stats.text} ${valuePostfix}`}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ColoredTable
