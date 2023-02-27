import { ArrowIcon } from 'ds_res/icons/ArrowIcon'
import React from 'react'
import { DropdownButton } from 'src/Base/components'
import { DropdownLabel } from 'src/Base/components/DropdownButton/DropdownLabel'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'

type TDropdown = {
  isLast?: boolean
  className?: string
  classNameDropdownButton?: string
  options: Array<TOptionObject>
  onChange: ({ name, value }: { name: string; value: TOptionObject }) => void
  name: string
  value: TOptionObject
}

export const DashDropdown = (props: TDropdown) => {
  const { className, name, classNameDropdownButton, isLast, options, onChange, value } = props
  const handleOnClick = (arg: TOptionObject) => {
    onChange({ name, value: arg })
  }
  return (
    <div className={className}>
      <DropdownButton
        isLast={isLast}
        dropdownLabel={<DropdownLabel reversed separated content={value.label} icon={<ArrowIcon />} type="secondary" />}
        className={classNameDropdownButton}
        dropdownChildren={options}
        handleClick={handleOnClick}
      />
    </div>
  )
}
