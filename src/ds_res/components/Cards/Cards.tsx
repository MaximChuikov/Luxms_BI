import React from 'react'
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
    <div className={style.tabsContainer}>
      {props.cardsData.map((e, index) => (
        <div key={index}>{e.title}</div>
      ))}
    </div>
  )
}

export default Cards
