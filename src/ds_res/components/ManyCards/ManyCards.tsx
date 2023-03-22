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

const ManyCards = (props: { cardsData: ISmallCard[] }) => {
  return (
    <div className={style.cardsContainer}>
      {props.cardsData.map((info, index) => (
        <div key={index} className={classNames(style.card, !info.stats.isIncrease && style.redCard)}>
          <div className={style.title}>{info.title}</div>
          <div className={style.stats}>
            <div className={classNames(style.value, !info.stats.isIncrease && style.redValue)}>{info.value}</div>
            <ArrowUpwardIcon className={classNames(style.arrow, !info.stats.isIncrease && style.redArr)} />
            <div>{info.stats.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ManyCards
