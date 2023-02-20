import { ArrowIcon } from 'ds_res/icons/ArrowIcon'
import React, { useState } from 'react'
import { DropdownButton } from 'src/Base/components'
import { DropdownLabel } from 'src/Base/components/DropdownButton/DropdownLabel'
import Color from 'ds_res/styles/Colors.module.scss'
import Option, { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import hash from 'object-hash'

type TDropdown = {
  isLast?: boolean
  className?: string
  classNameDropdownButton?: string
  options: Array<TOptionObject>
  onChange: ({ name, value }: { name: string; value: TOptionObject }) => void
  name: string
  value: TOptionObject
}

export const DashDropdown = ({
  className,
  name,
  classNameDropdownButton,
  isLast,
  options,
  onChange,
  value
}: TDropdown) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOnClick = (arg: TOptionObject) => {
    setIsOpen(!isOpen)
    onChange({ name, value: arg })
  }
  return (
    <div className={className}>
      <DropdownButton
        isLast={isLast}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dropdownLabel={
          <DropdownLabel
            reversed
            separated
            content={value.label}
            icon={<ArrowIcon />}
            type="secondary"
            isClicked={isOpen}
            background={Color.darkThemeDropdownBackground}
          />
        }
        onClick={() => setIsOpen(!isOpen)}
        className={classNameDropdownButton}
        dropdownChildren={
          <>
            {options.map((item, index) => (
              <Option onClick={() => handleOnClick(item)} index={index} option={item} key={hash(index)} />
            ))}
          </>
        }
      />
    </div>
  )
}
