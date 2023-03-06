import React, { useState } from 'react'
import { DashDropdown } from 'src/Base/components'
import { RadarChartWithLabel } from 'src/Base/components/RadarChart'
import { mockRadarChartData } from 'src/Base/components/RadarChart/mockData'
import { perspectivesOrTypes } from 'src/Base/constants/options'
import { UrlState } from 'bi-internal/core'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import styles from './PerspectiveDashWithRadarChart.module.scss'

export const PerspectiveDashWithRadarChart = () => {
  const urlState = UrlState.getInstance()
  const stateCharts = UrlState.getModel()
  const [dashState, setDashState] = useState({
    perspectivesOrTypes: { label: stateCharts.perspectivesOrTypes ?? perspectivesOrTypes[0].label }
  })

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDashState({
      ...dashState,
      [name]: value
    })
    urlState.updateModel({ [name]: value.label })
  }

  return (
    <section className={styles.dashWrapper}>
      <DashDropdown
        onChange={onSelect}
        name="perspectivesOrTypes"
        value={dashState.perspectivesOrTypes}
        options={perspectivesOrTypes}
        className={styles.dashletDropdown}
      />
      <RadarChartWithLabel chartData={mockRadarChartData} />
    </section>
  )
}
