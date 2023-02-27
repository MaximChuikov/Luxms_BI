import React from 'react'
import hash from 'object-hash'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import styles from './Tabs.module.scss'

interface TTabs<T extends { label: string }> {
  items: T[]
  name: string
  onSelect: ({ name, value }: { name: string; value: TOptionObject }) => void
  renderItem: (item: T) => React.ReactNode
}

export const Tabs = <T extends { label: string }>({ items, name, onSelect, renderItem }: TTabs<T>) => {
  return (
    <div title={name} className={styles.tabs}>
      {items.map((item) => {
        return (
          <div onClick={() => onSelect({ name, value: item })} key={hash(item)}>
            {renderItem(item)}
          </div>
        )
      })}
    </div>
  )
}
