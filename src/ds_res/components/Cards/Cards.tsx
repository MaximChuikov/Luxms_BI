import React from 'react'
import { ArrowIconForStats } from '../../icons/ArrowIconForStats'
import style from './cards.module.scss'

export interface ICard {
  title: string
  value: string
  stats: {
    isIncrease: boolean
    text: string
  }
}

const Cards = (props: { cardsData: ICard[] }) => {
  return (
    <div className={style.cardsContainer}>
      {props.cardsData.map((e, index) => (
        <div key={index} className={style.card}>
          <div className={style.title}>{e.title}</div>
          <div className={style.value}>{e.value}</div>
          <div className={style.stats}>
            <ArrowIconForStats className={style.arrow} />
            <div className={style.text}>{e.stats.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cards
