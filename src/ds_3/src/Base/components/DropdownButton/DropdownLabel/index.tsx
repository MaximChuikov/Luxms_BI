import React, { ReactNode } from 'react'
import styles from './DropdownLabel.module.scss'

type TDropdownLabel = {
  reversed?: boolean
  type?: 'primary' | 'secondary'
  separated?: boolean
  className?: string
  icon: ReactNode
  content: ReactNode
  background: string
  isClicked: boolean
}

export const DropdownLabel = ({
  reversed,
  separated,
  icon,
  type,
  content,
  background,
  isClicked,
  className
}: TDropdownLabel) => {
  const backgroundColor = {
    background
  } as React.CSSProperties

  return (
    <div
      style={backgroundColor}
      className={
        className ||
        [
          styles.dropdownBasic,
          separated ? styles.separated : '',
          type === 'secondary' ? styles.dropdownLabelSecondary : '',
          reversed ? styles.dropdownLabelReversed : styles.dropdownLabelStraight
        ].join(' ')
      }
    >
      <div className={[styles.iconBox, isClicked ? styles.reversed : ''].join(' ')}>{icon}</div>
      <div className={[styles.contentBox, separated ? styles.separated : ''].join(' ')}>{content}</div>
    </div>
  )
}
