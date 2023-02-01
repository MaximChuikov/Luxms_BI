import React, { ReactNode } from 'react'
import styles from './DropdownOption.module.scss'

export type TOptionObject = {
  label: string
  icon?: ReactNode
}

export type TOption = {
  option: TOptionObject
  index: number
  reversed?: boolean
  onClick: (arg: { option: TOptionObject; index: number }) => void
}

const Option = ({ option, index, onClick, reversed }: TOption) => (
  <button
    className={[styles.dropdownOption, reversed ? styles.reversed : ''].join(' ')}
    key={index}
    onClick={() => onClick({ option, index })}
  >
    {option.label}
    {option.icon || null}
  </button>
)

export default Option
