import React, { ReactNode, useRef } from 'react'
import { useOutsideClick } from 'src/Base/hooks/useClickOutside'
import classes from 'classnames'
import styles from './DropdownList.module.scss'

type TDropdownList = {
  className?: string
  children?: ReactNode
  isOpen?: boolean
  setIsOpen: (arg: boolean) => void
  isLast?: boolean
}

export const DropdownList = ({ className, children, isLast, isOpen, setIsOpen }: TDropdownList) => {
  const impactRef = useRef(null)
  useOutsideClick(impactRef, () => {
    setIsOpen(false)
  })
  return (
    <>
      {isOpen && (
        <div
          tabIndex={0}
          ref={impactRef}
          className={classes(className, styles.dropdownList, isLast && styles.lastDropdown)}
        >
          {children}
        </div>
      )}
    </>
  )
}
