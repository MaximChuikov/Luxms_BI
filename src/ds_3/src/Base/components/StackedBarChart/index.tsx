import React from 'react'
import { ComposedChart, Bar, XAxis, YAxis, LabelList } from 'recharts'
import Color from 'ds_res/styles/Colors.module.scss'
import { TStackedBarChart, TStackedBarChartData } from 'src/Base/components/StackedBarChart/types'
import { BarSVG } from 'src/Base/components/StackedBarChart/BarSVG'
import { hideIfBarSelected } from 'src/Base/components/StackedBarChart/utils/hideIfBarSelected'
// import styles from './StackedBarChart.module.scss'

export const StackedBarChart = ({
  chartData,
  isRelative,
  horizontallyOriented,
  selectedBar,
  dimensions
}: TStackedBarChart) => {
  const selectedDeviationType = selectedBar === 'allIndicators' ? '' : selectedBar
  const barSize =
    ((horizontallyOriented ? dimensions.height : dimensions.width - 52) * (67 / 100)) / (chartData.length - 1)
  const getSummary = (data: TStackedBarChartData | any) => {
    const { negativeIndicators = 0, positiveIndicators = 0, neutralIndicators = 0 } = data
    const summaryValue = negativeIndicators + positiveIndicators + neutralIndicators
    return selectedDeviationType ? data[selectedDeviationType] : summaryValue
  }
  return (
    <ComposedChart
      layout={horizontallyOriented ? 'vertical' : 'horizontal'}
      width={dimensions.width}
      height={dimensions.height}
      data={chartData}
      margin={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}
    >
      <XAxis
        dataKey={horizontallyOriented ? undefined : 'label'}
        type={horizontallyOriented ? 'number' : 'category'}
        hide={horizontallyOriented}
      />
      <YAxis
        dataKey={horizontallyOriented ? 'label' : undefined}
        type={horizontallyOriented ? 'category' : 'number'}
        hide={!horizontallyOriented}
      />
      {!isRelative && hideIfBarSelected('negativeIndicators', selectedDeviationType) && (
        <Bar dataKey="negativeIndicators" stackId="a" fill={Color.negativeTrendChartColor}>
          <LabelList dataKey={getSummary} position={horizontallyOriented ? 'right' : 'top'} />
        </Bar>
      )}
      {!isRelative && hideIfBarSelected('positiveIndicators', selectedDeviationType) && (
        <Bar dataKey="positiveIndicators" stackId="a" fill={Color.positiveTrendChartColor}>
          <LabelList dataKey={getSummary} position={horizontallyOriented ? 'right' : 'top'} />
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
                    barSize={barSize}
                  />
                )
              : undefined
          }
          dataKey="neutralIndicators"
          stackId="a"
          fill={Color.neutralChartColor}
        >
          {!isRelative && <LabelList dataKey={getSummary} position={horizontallyOriented ? 'right' : 'top'} />}
        </Bar>
      )}
    </ComposedChart>
  )
}
