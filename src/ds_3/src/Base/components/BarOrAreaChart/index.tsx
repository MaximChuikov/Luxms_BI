import React from 'react'
import { ComposedChart, Area, Bar, Cell } from 'recharts'
import { CurveType } from 'recharts/types/shape/Curve'
import { getAreaColors } from 'src/Base/utils/common'

export type TPeriodValues = {
  planValue: number
  actualValue: number
}

export type TCustomChartData = TPeriodValues[]

export type TChartAreaSettings = {
  width: number // в px
  height: number // в px
  areaChartType?: CurveType
  percentsOfSpaceBetweenBars?: number
  positiveFill?: string
  negativeFill?: string
  positiveStrokeColor?: string
  negativeStrokeColor?: string
  neutralFill?: string
  neutralStrokeColor?: string
}

export type TBarOrAreaChart = {
  isChartTypeArea: boolean
  indicatorType: number
  chartAreaSettings: TChartAreaSettings
  chartData: TCustomChartData
}

export const BarOrAreaChart = ({ isChartTypeArea, chartAreaSettings, chartData, indicatorType }: TBarOrAreaChart) => {
  const { width, height, percentsOfSpaceBetweenBars = 67, areaChartType = 'linear' } = chartAreaSettings
  const barSize = ((width - 52) * (percentsOfSpaceBetweenBars / 100)) / (chartData.length - 1)
  const deviation = chartData[chartData.length - 1].planValue
  const [strokeFill, areaFill] = getAreaColors(indicatorType, chartAreaSettings, deviation)
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
        <Area strokeWidth={2} type={areaChartType} dataKey="actualValue" fill={strokeFill} stroke={areaFill} />
      ) : (
        <Bar dataKey="actualValue">
          {chartData.map((entry, index) => {
            return (
              <Cell key={`cell-${index}`} fill={getAreaColors(indicatorType, chartAreaSettings, entry.planValue)[0]} />
            )
          })}
        </Bar>
      )}
    </ComposedChart>
  )
}
