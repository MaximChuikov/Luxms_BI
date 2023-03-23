import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import classNames from 'classnames'
import style from './round-diagram.module.scss'

export interface IRoundDiagramData {
  diagram: {
    title: string
    value: number
    stats: {
      isIncrease: boolean
      text: string
    }
  }[]
  centerDiagram: {
    title: string
    value: number
    stats: {
      isIncrease: boolean
      text: string
    }
  }
  valuePostfix: string
}

const RoundDiagram = ({ diagram, centerDiagram, valuePostfix }: IRoundDiagramData) => {
  const COLORS = [
    '#00C49F',
    '#673AB7',
    '#B1D43B',
    '#E91E63',
    '#FFE900',
    '#FF5722',
    '#F44336',
    '#FF9800',
    '#9C27B0',
    '#5FCF6F'
  ]
  if (diagram.length === 0) return <></>

  return (
    <div className={style.roundDiagramContainer}>
      <div className={style.tableContainer}>
        {diagram.map((row, index) => (
          <div
            className={style.tableRow}
            key={index}
            style={{ borderLeft: `6px solid ${COLORS[index % COLORS.length]}` }}
          >
            <div>{row.title}</div>
            <div className={style.value}>{`${row.value} ${valuePostfix}`}</div>
            <div className={style.stats}>
              <ArrowUpwardIcon className={classNames(style.arrow, !row.stats.isIncrease && style.redArr)} />
              {`${row.stats.text} ${valuePostfix}`}
            </div>
          </div>
        ))}
      </div>
      <div className={style.pieContainer}>
        <PieChart width={350} height={350} className={style.pie}>
          <Pie data={diagram} innerRadius={150} spacing={0} outerRadius={200} fill="#8884d8" dataKey="value">
            {diagram.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className={style.centerText}>
          <div className={style.title}>{centerDiagram.title}</div>
          <div className={style.value}>{`${centerDiagram.value} ${valuePostfix}`}</div>
          <div className={style.stats}>
            <ArrowUpwardIcon className={classNames(style.arrow, centerDiagram.stats.isIncrease && style.redArr)} />
            {centerDiagram.stats.text}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoundDiagram
