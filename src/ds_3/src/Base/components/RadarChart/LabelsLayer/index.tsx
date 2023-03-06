import React from 'react'
import styles from './LabelsLayer.module.scss'

export const LabelsLayer = () => {
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
    </div>
  )
}
