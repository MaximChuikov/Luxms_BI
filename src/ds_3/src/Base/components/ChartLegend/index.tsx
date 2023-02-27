import React, { useState } from 'react'
import hash from 'object-hash'
import classes from 'classnames'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { UrlState } from 'bi-internal/core'
import styles from './ChartLegend.module.scss'

interface TChartLegend<T extends { label: string; value: number; color: string }> {
  items: T[]
  indent?: number
  name: string
  onSelect: ({ name, value }: { name: string; value: TOptionObject }) => void
}

export const ChartLegend = <T extends { label: string; value: number; color: string }>({
  items,
  name,
  onSelect
}: TChartLegend<T>) => {
  const stateCharts = UrlState.getModel()
  const [selectedLabel, setSelectedLabel] = useState(stateCharts[name] || '')
  const handleLegendItemSelect = (item: TOptionObject) => {
    if (item.label === selectedLabel) {
      setSelectedLabel('')
      onSelect({ name, value: { label: '' } })
    } else {
      onSelect({ name, value: item })
      setSelectedLabel(item.label)
    }
  }
  return (
    <div title={name} className={styles.legendContainer}>
      {items.map((item) => {
        return (
          <div
            onClick={() => handleLegendItemSelect(item)}
            key={hash(item)}
            className={classes(
              styles.legendItem,
              selectedLabel !== '' && selectedLabel !== item.label && styles.shadowed
            )}
          >
            <div
              className={classes(styles.indicatorValueBox, selectedLabel === item.label && styles.boxBorder)}
              style={{ background: item.color }}
            >
              {item.value}
            </div>
            <p>{item.label}</p>
          </div>
        )
      })}
    </div>
  )
}
