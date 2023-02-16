import React, { useState } from 'react'
import IndicatorsTotalDash from 'src/Main/containers/IndicatorsTotalDash'
import { IndicatorsTableWithControls } from '../../containers/IndicatorsTableWithControls'
import styles from './IndicatorsPage.module.scss'

export const IndicatorsPage = () => {
  const [tableExpanded, setTableExpanded] = useState<boolean>(false)
  const handleTableExpansion = () => setTableExpanded((prev: boolean) => !prev)
  return (
    <div className={styles.indicatorsPageWrapper}>
      <div className={[styles.topDashboardsLine, tableExpanded ? styles.hide : ''].join(' ')}>
        <IndicatorsTotalDash />
        {/* TODO: поменять второй компонент IndicatorsTotalDash на оригинальный */}
        <IndicatorsTotalDash />
      </div>
      <IndicatorsTableWithControls position={tableExpanded} onExpandClick={handleTableExpansion} />
    </div>
  )
}
