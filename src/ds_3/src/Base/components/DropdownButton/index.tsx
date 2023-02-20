import React, { useEffect, useRef } from 'react'
import { DropdownList } from 'src/Base/components/DropdownButton/DropdownList'
import styles from './DropdownButton.module.scss'

type TDropdownButton = {
  className?: string
  dropdownChildren: JSX.Element
  dropdownLabel: JSX.Element
  isOpen: boolean
  setIsOpen: (arg: boolean) => void
  onClick: (arg: React.MouseEvent<HTMLButtonElement>) => void
  isLast?: boolean
}

export const DropdownButton = ({
  className,
  dropdownChildren,
  dropdownLabel,
  isOpen,
  setIsOpen,
  onClick,
  isLast
}: TDropdownButton) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onClick(event)
  }

  useEffect(() => {
    if (!isOpen) return
    const element = elementRef.current as HTMLDivElement
    if (element) element.focus()
  }, [isOpen, elementRef])

  return (
    <div className={[styles.dropdownButtonWrapper, className].join(' ')}>
      <button className={styles.dropdownButton} onClick={handleOnClick} type="button">
        {dropdownLabel}
      </button>
      <DropdownList isLast={isLast} setIsOpen={setIsOpen} isOpen={isOpen}>
        {dropdownChildren}
      </DropdownList>
    </div>
  )
}
