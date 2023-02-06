import React, { useEffect, useState } from 'react'
import Color from 'ds_res/styles/Colors.module.scss'
import { DashDropdown } from 'src/Base/components/DashDropdown'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { PieChartWithCustomLabel } from 'src/Base/components/PieChartWithCustomLabel'
import { data, labelSettings, options } from 'src/Main/containers/IndicatorsTotalDash/mockData'
import styles from './IndicatorsTotalDash.module.scss'

const chartColors = [Color.positiveTrendChartColor, Color.negativeTrendChartColor, Color.undefinedChartColor]

enum AssignmentsTrends {
  positite = 0,
  negative = 1,
  undefined = 2
}

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
  const [dashState, setDashState] = useState({
    perspectiveDropdown: options[0],
    indicatorsType: options[0],
    periods: options[0]
  })

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDashState({
      ...dashState,
      [name]: value
    })
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
          options={options}
          onChange={onSelect}
          className={styles.dashletDropdown}
        />
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.indicatorsType}
          name="indicatorsType"
          options={options}
          onChange={onSelect}
        />
        <DashDropdown
          className={styles.dashletDropdown}
          value={dashState.periods}
          name="periods"
          options={options}
          onChange={onSelect}
        />
      </div>
      <div className={styles.contentContainer}>
        <PieChartWithCustomLabel
          withSideIndication
          chartLabelInfo={labelSettings}
          segmentColors={chartColors}
          chartData={data}
          chartConfig={chartConfig}
        />
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <div className={styles.indicatorValueBox} style={{ background: chartColors[AssignmentsTrends.negative] }}>
              {data[AssignmentsTrends.negative].value}
            </div>
            <p>Негативные отклонения</p>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.indicatorValueBox} style={{ background: chartColors[AssignmentsTrends.positite] }}>
              {data[AssignmentsTrends.positite].value}
            </div>
            <p>Позитивные отклонения</p>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.indicatorValueBox} style={{ background: chartColors[AssignmentsTrends.undefined] }}>
              {data[AssignmentsTrends.undefined].value}
            </div>
            <p>Индикация не предусмотрена</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IndicatorsTotalDash
