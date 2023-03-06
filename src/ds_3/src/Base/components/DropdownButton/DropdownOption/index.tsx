import React, { ReactNode } from 'react'
import styles from './DropdownOption.module.scss'

export type TOptionObject = {
  label: string
  icon?: ReactNode
  value?: string
}

export type TOption = {
  option: TOptionObject
  index: number
  reversed?: boolean
  onClick: (arg: TOptionObject) => void
}

const Option = ({ option, onClick, reversed }: TOption) => (
  <button
    className={[styles.dropdownOption, reversed ? styles.reversed : ''].join(' ')}
    onClick={() => onClick(option)}
  >
    {option.label}
    {option.icon || null}
  </button>
)

export default Option
