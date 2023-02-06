import React, { LegacyRef, ReactNode } from 'react'
import styles from './DropdownList.module.scss'

type TDropdownList = {
  className?: string
  children?: ReactNode
  isOpen?: boolean
  onMouseOut: (event: React.MouseEvent<HTMLInputElement>) => void
  onMouseOver: (event: React.MouseEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => void
  elementRef: LegacyRef<HTMLDivElement> | undefined
}

const DropdownList = ({
  className,
  children,
  isOpen = false,
  onMouseOut,
  onMouseOver,
  onBlur,
  elementRef
}: TDropdownList) => {
  return (
    <>
      {isOpen && (
        <div
          tabIndex={0}
          ref={elementRef}
          className={className || styles.dropdownList}
          onMouseOut={onMouseOut}
          onMouseOver={onMouseOver}
          onBlur={onBlur}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default DropdownList
