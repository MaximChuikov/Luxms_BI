import React from 'react'
import style from './container.module.scss'

export interface IColoredContainerProps {
  TableComponent: JSX.Element
  PieComponent: JSX.Element
}

const ColoredDiagramsContainer = ({ TableComponent, PieComponent }: IColoredContainerProps) => {
  return (
    <div className={style.roundDiagramContainer}>
      {TableComponent}
      {PieComponent}
    </div>
  )
}

export default ColoredDiagramsContainer
