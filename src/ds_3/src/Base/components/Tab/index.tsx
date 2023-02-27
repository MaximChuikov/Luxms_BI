import React from 'react'
import classes from 'classnames'
import styles from './Tab.module.scss'

type TTab = {
  label: string
  isSelected: boolean
  classname?: string
}

export const Tab = ({ label, classname, isSelected }: TTab) => {
  return <div className={classes(styles.tab, classname, isSelected && styles.selected)}>{label}</div>
}
