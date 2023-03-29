import React from 'react'
import style from './loading.module.scss'
import CardLoading from './CardLoading'

const ManyCardsLoading = () => {
  const cards = [...Array(12)].map((_, index) => {
    return <CardLoading key={index} />
  })
  return <div className={style.bigLoadingContainer}>{cards}</div>
}

export default ManyCardsLoading
