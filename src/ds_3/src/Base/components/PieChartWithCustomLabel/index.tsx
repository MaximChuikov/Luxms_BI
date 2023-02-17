import React from 'react'
import { PieChart, Pie, Label, Cell } from 'recharts'
import { CustomChartLabel, TChartLabelInfo } from 'src/Base/components/CustomChartLabel'
import styles from './PieChartWithCustomLabel.module.scss'

type TPieChartConfig = {
  outerRadius: number
  innerRadius: number
  cx: number
  cy: number
  chartWidth: number
  charHeight: number
}

type TPieChartSegmentData = {
  name: string
  value: number
}

type TPieChart = {
  segmentColors: string[]
  chartData: Array<TPieChartSegmentData>
  chartConfig: TPieChartConfig
  chartLabelInfo: TChartLabelInfo
  withSideIndication?: boolean
}

export const PieChartWithCustomLabel = ({
  segmentColors,
  chartData,
  chartConfig,
  chartLabelInfo,
  withSideIndication
}: TPieChart) => {
  const { outerRadius, innerRadius, cx, cy, charHeight, chartWidth } = chartConfig

  return (
    <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} width={chartWidth} height={charHeight}>
      <Pie
        data={chartData}
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        stroke={'0'}
        fill="#8884d8"
        paddingAngle={0}
        dataKey="value"
        labelLine={false}
        label={({ midAngle, value, index }) => {
          const RADIAN = Math.PI / 180
          const radius = 10 + innerRadius + (outerRadius - innerRadius)
          const x = cx + radius * Math.cos(-midAngle * RADIAN)
          const y = cy + radius * Math.sin(-midAngle * RADIAN)
          if (value < 30) {
            return null
          }
          return index !== 2 && !!withSideIndication ? (
            <text
              x={x}
              y={y}
              className={styles.labelFont}
              fontWeight="400"
              fontSize="16px"
              fontFamily="Arial"
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central"
            >
              <tspan
                style={{
                  fill: 'rgb(255, 105, 0)'
                }}
              >
                {index === 0 ? '▲ ' : '▼ '}
              </tspan>
              {index === 0 ? '+ ' : '- '}
              {chartData[index].value}
            </text>
          ) : null
        }}
      >
        {chartData.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={segmentColors[index % segmentColors.length]} />
        ))}
        <Label
          width={300}
          position="inside"
          content={<CustomChartLabel cx={cx} cy={cy} labelSetting={chartLabelInfo} />}
        />
      </Pie>
    </PieChart>
  )
}
