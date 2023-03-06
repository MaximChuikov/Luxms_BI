import React, { useState } from 'react'
import { StackedBarChart } from 'src/Base/components/StackedBarChart'
import { UrlState } from 'bi-internal/core'
import { DashDropdown } from 'src/Base/components'
import { dataFormat, deviationTypesOptions } from 'src/Base/constants/options'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { TSelectedIndicatorBar, TStackedBarChartData } from 'src/Base/components/StackedBarChart/types'
import cx from 'classnames'
import { getOptionByValue } from 'src/Base/utils/getOptionByValue'
import styles from './DashWithBarChart.module.scss'

type TDashWithBarChart = {
  charthorizontallyOriented?: boolean
  isLarge?: boolean
  data: TStackedBarChartData[]
  dashLabel: string
}

export const DashWithBarChart = ({
  charthorizontallyOriented = false,
  isLarge = false,
  data,
  dashLabel
}: TDashWithBarChart) => {
  const urlState = UrlState.getInstance()
  const stateCharts = UrlState.getModel()
  const [dashState, setDashState] = useState({
    selectedBar: stateCharts.deviationTypes || '',
    deviationTypes: stateCharts.deviationType
      ? getOptionByValue({ options: deviationTypesOptions, value: stateCharts.deviationTypes })
      : deviationTypesOptions[0],
    departmentsDataFormat: stateCharts.departmentsDataFormat
      ? getOptionByValue({ options: deviationTypesOptions, value: stateCharts.departmentsDataFormat })
      : deviationTypesOptions[0]
  })
  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDashState({
      ...dashState,
      [name]: value
    })
    urlState.updateModel({ [name]: value })
  }
  const isRelative = dashState.departmentsDataFormat.value === 'relative'
  return (
    <section className={styles.dashWithBarChartWrapper}>
      <div className={cx(styles.dashHeader, isLarge && styles.headerAligned)}>
        <p className={cx(styles.dashTitle, isLarge && styles.titleCentred)}>{dashLabel}</p>
        {/* TODO: добавить индикацию выбранного значения */}
        <DashDropdown
          options={dataFormat}
          onChange={onSelect}
          name="departmentsDataFormat"
          value={dashState.departmentsDataFormat}
          isLast
        />
      </div>
      <StackedBarChart
        chartData={data}
        isRelative={isRelative}
        horizontallyOriented={charthorizontallyOriented}
        selectedBar={dashState.deviationTypes.value as TSelectedIndicatorBar}
      />
    </section>
  )
}
