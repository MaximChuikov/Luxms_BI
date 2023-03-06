import React, { useState } from 'react'
import { DashDropdown, Link, PieChartWithCustomLabel } from 'src/Base/components'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { Tabs } from 'src/Base/components/Tabs'
import { Tab } from 'src/Base/components/Tab'
import { UrlState } from 'bi-internal/core'
import { evaluationPerspectives, indicatorsTypes, periodTypes } from 'src/Base/constants/options'
import { Button } from 'src/Base/components/Button'
import { ButtonArrowIcon } from 'ds_res/icons/ButtonArrowIcon'
import Color from 'ds_res/styles/Colors.module.scss'
import { data } from 'src/Main/containers/IndicatorsTotalDash/mockData'
import { TChartLabelInfo } from 'src/Base/components/CustomChartLabel'
import { ChartLegend } from 'src/Base/components/ChartLegend'
import styles from './SummaryTotalDashWithTabs.module.scss'

const chartColors = [Color.positiveTrendChartColor, Color.negativeTrendChartColor, Color.neutralChartColor]

export const labelSettings: TChartLabelInfo = {
  labelHeader: 'Всего отклонений:',
  labelData: 'XXX',
  labelHeaderFontSize: 16,
  labellabelDataFontSize: 36
}

export const SummaryTotalDashWithTabs = () => {
  const urlState = UrlState.getInstance()
  const stateCharts = UrlState.getModel()
  const [dashState, setDashState] = useState({
    periodTypes: { label: stateCharts?.periodTypes || periodTypes[0].label },
    indicatorsType: { label: stateCharts?.indicatorsType || indicatorsTypes[0].label },
    evaluationPerspectives: { label: stateCharts?.evaluationPerspectives || evaluationPerspectives[0].label },
    deviationTypes: { label: stateCharts?.deviationTypes || data[0].label }
  })

  const activeBar = stateCharts?.deviationTypes || ''

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDashState({
      ...dashState,
      [name]: value
    })
    urlState.updateModel({ [name]: value.label })
  }
  return (
    <div className={styles.dashWrapper}>
      <Tabs
        onSelect={onSelect}
        name="evaluationPerspectives"
        items={evaluationPerspectives}
        renderItem={(item) => (
          <Tab isSelected={dashState.evaluationPerspectives.label === item.label} label={item.label} />
        )}
      />
      <div className={styles.filtersContainer}>
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.periodTypes}
          name="periodTypes"
          options={periodTypes}
          onChange={onSelect}
        />
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.indicatorsType}
          name="indicatorsType"
          options={indicatorsTypes}
          onChange={onSelect}
          isLast={true}
        />
      </div>
      <div className={styles.contentContainer}>
        <PieChartWithCustomLabel
          activeBar={activeBar}
          chartLabelInfo={labelSettings}
          segmentColors={chartColors}
          chartData={data}
        />
        <ChartLegend items={data} name="deviationTypes" onSelect={onSelect} />
      </div>
      {/* TODO: add correct link */}
      <Link href="/toSmth">
        <Button label="К списку показателей" icon={<ButtonArrowIcon />} />
      </Link>
    </div>
  )
}
