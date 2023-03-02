import React from 'react'
import { TRadarLabel } from 'src/Base/components/RadarChart/types'
import styles from './PolarAngleAxisLabel.module.scss'

export const RadarLabel = ({ perspective, allIndicators, unfulfilledIndicators, coordinates }: TRadarLabel) => {
  return (
    <div className={styles.axisLabel} style={{ top: coordinates.y, left: coordinates.x }}>
      <div className={styles.valuesContainer}>
        <div className={styles.allIndicatorsBox}>{allIndicators}</div>
        <div className={styles.negativeIndicatorsBox}>{unfulfilledIndicators}</div>
      </div>
      <p>{perspective}</p>
    </div>
  )
}
