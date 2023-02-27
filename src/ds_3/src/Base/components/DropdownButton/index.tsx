import React, { useRef, useState } from 'react'
import { DropdownList } from 'src/Base/components/DropdownButton/DropdownList'
import { useOutsideClick } from 'src/Base/hooks/useClickOutside'
import Option, { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import hash from 'object-hash'
import styles from './DropdownButton.module.scss'

type TDropdownButton = {
  className?: string
  dropdownChildren: TOptionObject[]
  dropdownLabel: JSX.Element
  handleClick: (arg: TOptionObject) => void
  isLast?: boolean
}

export const DropdownButton = ({
  className,
  dropdownChildren,
  dropdownLabel,
  isLast,
  handleClick
}: TDropdownButton) => {
  const [isOpen, setIsOpen] = useState(false)
  const impactRef = useRef(null)
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsOpen((prev) => !prev)
  }
  const handleSelect = (arg: TOptionObject) => {
    handleClick(arg)
    setIsOpen(false)
  }

  useOutsideClick(impactRef, () => {
    setIsOpen(false)
  })

  return (
    <div id={hash(dropdownLabel)} ref={impactRef} className={[styles.dropdownButtonWrapper, className].join(' ')}>
      <button className={styles.dropdownButton} onClick={handleOnClick} type="button">
        {dropdownLabel}
      </button>
      {isOpen && (
        <DropdownList isLast={isLast}>
          {dropdownChildren.map((item, index) => (
            <Option onClick={handleSelect} index={index} option={item} key={hash(index)} />
          ))}
        </DropdownList>
      )}
    </div>
  )
}
