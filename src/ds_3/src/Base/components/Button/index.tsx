import React, { ReactNode } from 'react'
import classes from 'classnames'
import styles from './Button.module.scss'

type TButton = {
  icon?: ReactNode
  label: string
  reversed?: boolean
}

export const Button = ({ icon, reversed, label }: TButton) => {
  return (
    <div role="button" className={classes(styles.button, reversed ? styles.reversed : '')}>
      {label}
      {icon}
    </div>
  )
}
