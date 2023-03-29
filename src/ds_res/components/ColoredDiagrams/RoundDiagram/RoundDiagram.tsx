import React from 'react'
import { PieChart, Pie, Cell, Legend } from 'recharts'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import classNames from 'classnames'
import { getColor } from '../../../utils/colors'
import style from './round-diagram.module.scss'

export interface IRoundDiagramData {
  diagram: {
    value: number
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
  if (diagram.length === 0) return <></>

  return (
    <div className={style.pieContainer}>
      <PieChart width={350} height={350} className={style.pie}>
        <Pie data={diagram} innerRadius={150} spacing={0} outerRadius={200} fill="#8884d8" dataKey="value">
          {diagram.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
        </Pie>
        <Legend
          verticalAlign={'middle'}
          align={'center'}
          content={
            <div className={style.legend}>
              <div className={style.title}>{centerDiagram.title}</div>
              <div className={style.value}>{`${centerDiagram.value} ${valuePostfix}`}</div>
              <div className={style.stats}>
                <ArrowUpwardIcon className={classNames(style.arrow, centerDiagram.stats.isIncrease && style.redArr)} />
                {centerDiagram.stats.text}
              </div>
            </div>
          }
        />
      </PieChart>
    </div>
  )
}

export default RoundDiagram
