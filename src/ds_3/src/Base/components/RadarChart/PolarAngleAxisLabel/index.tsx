import React from 'react'
import { TRadarAxis } from 'src/Base/components/RadarChart/types'
import styles from './PolarAngleAxisLabel.module.scss'

export const RadarLabel = (props: TRadarAxis) => {
  const { payload, x, y } = props
  const [perspective, allIndicators, unfulfilledIndicators] = payload.value.split(',')
  return (
    <foreignObject className={styles.labelContainer} x={x} y={y}>
      <div className={styles.axisLabel}>
        <div className={styles.valuesContainer}>
          <div className={styles.allIndicatorsBox}>{allIndicators}</div>
          <div className={styles.negativeIndicatorsBox}>{unfulfilledIndicators}</div>
        </div>
        <p>{perspective}</p>
      </div>
    </foreignObject>
  )
}
