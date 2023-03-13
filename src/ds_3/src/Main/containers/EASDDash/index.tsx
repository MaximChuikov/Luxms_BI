/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { Button, DashDropdown, Link, PieChartWithCustomLabel } from 'src/Base/components'
import { ChartLegend } from 'src/Base/components/ChartLegend'
import Color from 'ds_res/styles/Colors.module.scss'
import { EASDOptions, EASDСOptions, EASDСZOptions } from 'src/Base/constants/options'
import { labelSettings } from 'src/Main/containers/SummaryTotalDashWithTabs'
import { UrlState } from 'bi-internal/core'
import { getOptionByValue } from 'src/Base/utils/getOptionByValue'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { LoupeWithTrendIcon, RedirectIcon } from 'ds_res/icons'
import { data } from 'src/Main/containers/EASDDash/mockData'
import styles from './EASDDash.module.scss'

const chartColors = [Color.positiveTrendChartColor, Color.negativeTrendChartColor, Color.neutralChartColor]

const assignmentsDropdownOptions = {
  easdC: EASDСOptions,
  easdCZ: EASDСZOptions
}

type TEASDOptions = keyof typeof assignmentsDropdownOptions

export const EASDDash = () => {
  const urlState = UrlState.getInstance()
  urlState.subscribeUpdatesAndNotify(() => {})
  const stateCharts = UrlState.getModel()
  const [dashState, setDashState] = useState({
    easdDropdown: stateCharts.easdDropdown
      ? getOptionByValue({ options: EASDOptions, value: stateCharts.easdDropdown })
      : EASDOptions[0],
    assignmentsDropdown: stateCharts.assignmentsDropdown
      ? getOptionByValue({ options: EASDСOptions, value: stateCharts.assignmentsDropdown })
      : EASDСOptions[0]
  })

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    if (name === 'easdDropdown') {
      setDashState({
        ...dashState,
        [name]: value,
        assignmentsDropdown: assignmentsDropdownOptions[value.value as TEASDOptions][0]
      })
      urlState.updateModel({
        assignmentsDropdown: assignmentsDropdownOptions[value.value as TEASDOptions][0].value
      })
    } else {
      setDashState({
        ...dashState,
        [name]: value
      })
    }
    urlState.updateModel({ [name]: value.value })
  }

  return (
    <section className={styles.EASDDashWrapper}>
      <div className={styles.filtersContainer}>
        <DashDropdown
          value={dashState.easdDropdown}
          name="easdDropdown"
          options={EASDOptions}
          onChange={onSelect}
          className={styles.dashletDropdown}
        />
        <DashDropdown
          isLast
          value={dashState.assignmentsDropdown}
          name="assignmentsDropdown"
          options={assignmentsDropdownOptions[dashState.easdDropdown.value as TEASDOptions]}
          onChange={onSelect}
          className={styles.dashletDropdown}
        />
      </div>
      <div className={styles.contentContainer}>
        <PieChartWithCustomLabel chartLabelInfo={labelSettings} segmentColors={chartColors} chartData={data} />
        <ChartLegend name="deviationTypes" items={data} onSelect={onSelect} />
      </div>
      <div className={styles.linkContainer}>
        <Link href="/toSmth">
          <Button label="К аналитике по поручениям" icon={<LoupeWithTrendIcon />} />
        </Link>
        <Link href="/toSmth">
          <Button label="К поручениям" icon={<RedirectIcon />} />
        </Link>
      </div>
    </section>
  )
}
