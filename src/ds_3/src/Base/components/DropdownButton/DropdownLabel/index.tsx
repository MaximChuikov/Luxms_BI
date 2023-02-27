import React, { ReactNode, useRef, useState } from 'react'
import { useOutsideClick } from 'src/Base/hooks/useClickOutside'
import styles from './DropdownLabel.module.scss'

type TDropdownLabel = {
  reversed?: boolean
  type?: 'primary' | 'secondary'
  separated?: boolean
  className?: string
  icon: ReactNode
  content: ReactNode
}

export const DropdownLabel = ({ reversed, separated, icon, type, content, className }: TDropdownLabel) => {
  const impactRef = useRef(null)
  const [isClicked, setIsClicked] = useState(false)
  useOutsideClick(impactRef, () => {
    setIsClicked(false)
  })
  return (
    <div
      ref={impactRef}
      onClick={() => setIsClicked(!isClicked)}
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
