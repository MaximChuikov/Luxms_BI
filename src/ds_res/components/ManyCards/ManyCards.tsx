import React from 'react'
import style from './many-cards.module.scss'
import SmallCard, { ISmallCard } from './SmallCard'

export interface ISmallCardsProps {
  cardsData: ISmallCard[]
}

const ManyCards = ({ cardsData }: ISmallCardsProps) => {
  return (
    <div className={style.cardsContainer}>
      {cardsData.map((info, index) => (
        <SmallCard title={info.title} value={info.value} stats={info.stats} key={index} />
      ))}
    </div>
  )
}

export default ManyCards
