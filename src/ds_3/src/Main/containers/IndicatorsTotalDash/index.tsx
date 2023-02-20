import React, { useEffect, useState } from 'react'
import Color from 'ds_res/styles/Colors.module.scss'
import { DashDropdown } from 'src/Base/components/DashDropdown'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { PieChartWithCustomLabel } from 'src/Base/components/PieChartWithCustomLabel'
import { data, labelSettings } from 'src/Main/containers/IndicatorsTotalDash/mockData'
import { UrlState } from 'bi-internal/core'
import { evaluationPerspectives, indicatorsTypes, periodTypes } from 'src/Base/constants/options'
import { ChartLegend } from 'src/Base/components/ChartLegend'
import styles from './IndicatorsTotalDash.module.scss'

const chartColors = [Color.positiveTrendChartColor, Color.negativeTrendChartColor, Color.neutralChartColor]

const chartConfig = {
  outerRadius: 80,
  innerRadius: 60,
  cx: 80,
  cy: 80,
  chartWidth: 160,
  charHeight: 160
}

type TIndicatorsTotalDash = {
  gridArea?: string
}

const IndicatorsTotalDash = ({ gridArea }: TIndicatorsTotalDash) => {
  const urlState = UrlState.getInstance()
  urlState.subscribeUpdatesAndNotify(() => {})
  const stateCharts = UrlState.getModel()

  const [dashState, setDashState] = useState({
    perspectiveDropdown: { label: stateCharts.perspectiveDropdown ?? evaluationPerspectives[0].label },
    indicatorsType: { label: stateCharts.indicatorsType ?? indicatorsTypes[0].label },
    periods: { label: stateCharts.periods ?? periodTypes[0].label }
  })

  const activeBar = stateCharts.deviationTypes || ''

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDashState({
      ...dashState,
      [name]: value
    })
    urlState.updateModel({ [name]: value.label })
  }

  useEffect(() => {
    // api
  }, [dashState])

  return (
    <section style={{ gridArea }} className={styles.indicatorsTotalDashWrapper}>
      <div className={styles.filtersContainer}>
        <DashDropdown
          value={dashState.perspectiveDropdown}
          name="perspectiveDropdown"
          options={evaluationPerspectives}
          onChange={onSelect}
          className={styles.dashletDropdown}
        />
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.indicatorsType}
          name="indicatorsType"
          options={indicatorsTypes}
          onChange={onSelect}
        />
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.periods}
          name="periods"
          options={periodTypes}
          onChange={onSelect}
          isLast={true}
        />
      </div>
      <div className={styles.contentContainer}>
        <PieChartWithCustomLabel
          activeBar={activeBar}
          withSideIndication
          chartLabelInfo={labelSettings}
          segmentColors={chartColors}
          chartData={data}
          chartConfig={chartConfig}
        />
        <ChartLegend name="deviationTypes" items={data} onSelect={onSelect} />
      </div>
    </section>
  )
}

export default IndicatorsTotalDash
