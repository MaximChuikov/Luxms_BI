import React, { ReactNode } from 'react'
import classes from 'classnames'
import styles from './DropdownList.module.scss'

type TDropdownList = {
  className?: string
  children?: ReactNode[]
  isLast?: boolean
}

export const DropdownList = ({ className, children, isLast }: TDropdownList) => {
  return (
    <div tabIndex={0} className={classes(className, styles.dropdownList, isLast && styles.lastDropdown)}>
      {children}
    </div>
  )
}
