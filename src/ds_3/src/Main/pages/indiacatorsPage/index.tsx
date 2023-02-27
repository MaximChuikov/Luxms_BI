import React, { useCallback, useState } from 'react'
import { IndicatorsTotalDash } from 'src/Main/containers/IndicatorsTotalDash'
import { IndicatorsTableWithControls } from '../../containers/IndicatorsTableWithControls'
import styles from './IndicatorsPage.module.scss'

export const IndicatorsPage = React.memo(function IndicatorsPage() {
  const [tableExpanded, setTableExpanded] = useState<boolean>(false)
  const handleTableExpansion = useCallback(() => setTableExpanded((prev: boolean) => !prev), [setTableExpanded])
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
})
