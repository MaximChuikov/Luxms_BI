import React from 'react'
import { Bar, XAxis, YAxis, LabelList, BarChart, ResponsiveContainer } from 'recharts'
import Color from 'ds_res/styles/Colors.module.scss'
import { TStackedBarChart, TStackedBarChartData } from 'src/Base/components/StackedBarChart/types'
import { BarSVG } from 'src/Base/components/StackedBarChart/BarSVG'
import { hideIfBarSelected } from 'src/Base/components/StackedBarChart/utils/hideIfBarSelected'
import styles from './StackedBarChart.module.scss'

export const StackedBarChart = ({ chartData, isRelative, horizontallyOriented, selectedBar }: TStackedBarChart) => {
  const selectedDeviationType = selectedBar === 'allIndicators' ? '' : selectedBar
  const getSummary = (data: TStackedBarChartData | any) => {
    const { negativeIndicators = 0, positiveIndicators = 0, neutralIndicators = 0 } = data
    const summaryValue = negativeIndicators + positiveIndicators + neutralIndicators
    return selectedDeviationType ? data[selectedDeviationType] : summaryValue
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout={horizontallyOriented ? 'vertical' : 'horizontal'}
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <XAxis
            className={styles.axis}
            dataKey={horizontallyOriented ? undefined : 'label'}
            type={horizontallyOriented ? 'number' : 'category'}
            hide={horizontallyOriented}
            stroke={Color.fontColor}
            interval={0}
          />
          <YAxis
            className={styles.axis}
            interval={0}
            dataKey={horizontallyOriented ? 'label' : undefined}
            type={horizontallyOriented ? 'category' : 'number'}
            hide={!horizontallyOriented}
          />
          {!isRelative && hideIfBarSelected('negativeIndicators', selectedDeviationType) && (
            <Bar dataKey="negativeIndicators" stackId="a" fill={Color.negativeTrendChartColor}>
              <LabelList dataKey={'negativeIndicators'} position={'center'} />
            </Bar>
          )}
          {!isRelative && hideIfBarSelected('positiveIndicators', selectedDeviationType) && (
            <Bar dataKey="positiveIndicators" stackId="a" fill={Color.positiveTrendChartColor}>
              <LabelList dataKey={'positiveIndicators'} position={'center'} />
            </Bar>
          )}
          {(isRelative || hideIfBarSelected('neutralIndicators', selectedDeviationType)) && (
            <Bar
              shape={
                isRelative
                  ? (data) => (
                      <BarSVG
                        data={data}
                        selectedDeviationType={selectedDeviationType}
                        horizontallyOriented={horizontallyOriented}
                      />
                    )
                  : undefined
              }
              dataKey="neutralIndicators"
              stackId="a"
              fill={Color.neutralChartColor}
            >
              {!isRelative && <LabelList dataKey={'neutralIndicators'} position={'center'} />}
              {!isRelative && <LabelList dataKey={getSummary} position={horizontallyOriented ? 'right' : 'top'} />}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
