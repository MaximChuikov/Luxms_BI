import React from 'react'
import { RadarLabel } from 'src/Base/components/RadarChart/PolarAngleAxisLabel'
import { TLabelsLayer } from 'src/Base/components/RadarChart/types'
import styles from './LabelsLayer.module.scss'

export const LabelsLayer = ({ radarLabelData }: TLabelsLayer) => {
  const arrayRefined = radarLabelData.map((x, i, a) => {
    const item = { ...x }
    switch (true) {
      case i > Math.floor(a.length / 2):
        item.coordinates.x -= 130
        break
      case i === 0:
        item.coordinates.y -= 40
        item.coordinates.x -= 60
        break
      case i < Math.ceil(a.length / 2) && i !== 0:
        item.coordinates.y += 10
        item.coordinates.x += 20
        break
      default:
        break
    }
    return item
  })
  return (
    <div className={styles.labelsField}>
      <div className={styles.legendContainer}>
        <div className={styles.legendItem}>
          <div className={styles.allIndicatorsLabel} />
          <p>Все показатели</p>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.unfulfilledIndicatorsLabel} />
          <p>Невыполнение</p>
        </div>
      </div>
      {arrayRefined.map((item, index) => {
        return (
          <RadarLabel
            key={index}
            coordinates={item.coordinates}
            perspective={item.perspective}
            allIndicators={item.allIndicators}
            unfulfilledIndicators={item.unfulfilledIndicators}
          />
        )
      })}
    </div>
  )
}
