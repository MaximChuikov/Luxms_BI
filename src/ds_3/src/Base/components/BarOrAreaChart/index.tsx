import React from 'react'
import { ComposedChart, Area, Bar, Cell } from 'recharts'
import { CurveType } from 'recharts/types/shape/Curve'

type TPeriodValues = {
  planValue: number
  actualValue: number
}

type TCustomChartData = TPeriodValues[]

type TChartAreaSettings = {
  width: number
  height: number
  areaChartType?: CurveType
  percentsOfSpaceBetweenBars?: number
  positiveFill?: string
  negativeFill?: string
  positiveStrokeColor?: string
  negativeStrokeColor?: string
}

type TBarOrAreaChart = {
  isChartTypeArea: boolean
  chartAreaSettings: TChartAreaSettings
  chartData: TCustomChartData
}

export const BarOrAreaChart = ({ isChartTypeArea, chartAreaSettings, chartData }: TBarOrAreaChart) => {
  const {
    width,
    height,
    percentsOfSpaceBetweenBars = 67,
    positiveFill = 'rgba(120, 214, 75, 0.5)',
    positiveStrokeColor = '#78D64B',
    negativeFill = 'rgba(255, 105, 0, 0.3)',
    negativeStrokeColor = '#FF6900',
    areaChartType = 'linear'
  } = chartAreaSettings

  const barSize = ((width - 52) * (percentsOfSpaceBetweenBars / 100)) / (chartData.length - 1)

  const planFactPeriodsDifArr: number[] = chartData.reduce((a, c) => {
    a.push(c.actualValue - c.planValue)
    return a
  }, [])

  const isPositiveTrend = planFactPeriodsDifArr[planFactPeriodsDifArr.length - 1] > 0

  return (
    <ComposedChart
      width={width}
      height={height}
      data={chartData}
      barSize={barSize}
      margin={{
        top: 0,
        right: 26,
        bottom: 0,
        left: 26
      }}
    >
      {isChartTypeArea ? (
        <Area
          strokeWidth={2}
          type={areaChartType}
          dataKey="actualValue"
          fill={isPositiveTrend ? positiveFill : negativeFill}
          stroke={isPositiveTrend ? positiveStrokeColor : negativeStrokeColor}
        />
      ) : (
        <Bar dataKey="actualValue">
          {planFactPeriodsDifArr.map((entry, index) => {
            const isPositive = entry > 0
            return <Cell key={`cell-${index}`} fill={isPositive ? positiveFill : negativeFill} />
          })}
        </Bar>
      )}
    </ComposedChart>
  )
}
