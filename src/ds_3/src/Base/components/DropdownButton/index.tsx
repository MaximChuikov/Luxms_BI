import React, { useEffect, useRef, useState } from 'react'
import DropdownList from 'src/Base/components/DropdownButton/DropdownList'
import styles from './DropdownButton.module.scss'

type TDropdownButton = {
  className?: string
  dropdownChildren: JSX.Element
  dropdownLabel: JSX.Element
  isOpen: boolean
  setIsOpen: (arg: boolean) => void
  onClick: (arg: React.MouseEvent<HTMLButtonElement>) => void
}

const DropdownButton = ({
  className,
  dropdownChildren,
  dropdownLabel,
  isOpen,
  setIsOpen,
  onClick
}: TDropdownButton) => {
  const [isDropdownMouseOut, setIsDropdownMouseOut] = useState(false)
  const [isDropdownButtonMouseOut, setIsDropdownButtonMouseOut] = useState(false)
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
      <button
        className={styles.dropdownButton}
        onClick={handleOnClick}
        type="button"
        onMouseOut={() => {
          setIsDropdownButtonMouseOut(false)
        }}
        onMouseOver={() => {
          setIsDropdownButtonMouseOut(true)
        }}
      >
        {dropdownLabel}
      </button>
      <DropdownList
        className=""
        isOpen={isOpen}
        elementRef={elementRef}
        onMouseOut={() => {
          setIsDropdownMouseOut(false)
        }}
        onMouseOver={() => {
          setIsDropdownMouseOut(true)
        }}
        onBlur={() => {
          if (setIsOpen && !isDropdownButtonMouseOut) setIsOpen(isDropdownMouseOut)
        }}
      >
        {dropdownChildren}
      </DropdownList>
    </div>
  )
}

export default DropdownButton
