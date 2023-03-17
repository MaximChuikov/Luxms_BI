import React from 'react'
import styles from './Button.module.scss'

type ButtonProps = {
  width?: string | number
  children: React.ReactNode
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ children, width, onClick }) => {
  return (
    <button style={{ width }} className={styles.button} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
