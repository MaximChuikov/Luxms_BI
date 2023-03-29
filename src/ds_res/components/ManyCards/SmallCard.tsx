import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import classNames from 'classnames'
import style from './many-cards.module.scss'

export interface ISmallCard {
  title: string
  value: string
  stats: {
    isIncrease: boolean
    text: string
  }
}

const SmallCard = ({ value, title, stats }: ISmallCard) => {
  return (
    <div className={classNames(style.card, !stats.isIncrease && style.redCard)}>
      <div className={style.title}>{title}</div>
      <div className={style.stats}>
        <div className={classNames(style.value, !stats.isIncrease && style.redValue)}>{value}</div>
        <ArrowUpwardIcon className={classNames(style.arrow, !stats.isIncrease && style.redArr)} />
        <div>{stats.text}</div>
      </div>
    </div>
  )
}

export default SmallCard
