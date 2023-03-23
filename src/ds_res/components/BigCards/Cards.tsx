import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import style from './cards.module.scss'

export interface ICard {
  title: string
  value: string
  stats: {
    isIncrease: boolean
    text: string
  }
}
export interface ICardsProps {
  cardsData: ICard[]
}
const Cards = ({ cardsData }: ICardsProps) => {
  return (
    <div className={style.cardsContainer}>
      {cardsData.map((e, index) => (
        <div key={index} className={style.card}>
          <div className={style.title}>{e.title}</div>
          <div className={style.value}>{e.value}</div>
          <div className={style.stats}>
            <ArrowUpwardIcon className={[style.arrow, !e.stats.isIncrease && style.down].join(' ')} />
            <div>{e.stats.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cards
