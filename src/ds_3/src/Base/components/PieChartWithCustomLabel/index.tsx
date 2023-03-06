import React from 'react'
import { PieChart, Pie, Label, Cell, ResponsiveContainer } from 'recharts'
import { PolarViewBox } from 'recharts/types/util/types'
import { CustomChartLabel, TChartLabelInfo } from 'src/Base/components/CustomChartLabel'
import styles from './PieChartWithCustomLabel.module.scss'

type TPieChartSegmentData = {
  label: string
  value: number
}

type TPieChart = {
  segmentColors: string[]
  chartData: Array<TPieChartSegmentData>
  chartLabelInfo: TChartLabelInfo
  withSideIndication?: boolean
  activeBar?: string
}

export const PieChartWithCustomLabel = ({
  segmentColors,
  chartData,
  chartLabelInfo,
  withSideIndication,
  activeBar = ''
}: TPieChart) => {
  return (
    <ResponsiveContainer aspect={1}>
      <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <Pie
          data={chartData}
          innerRadius={'71.2%'}
          outerRadius={'100%'}
          stroke={'0'}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          labelLine={false}
          label={({ midAngle, value, index, cx, cy, innerRadius, outerRadius }: { [key: string]: number }) => {
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
          {chartData.map((_entry, index) => {
            const isShadowed = activeBar !== '' && activeBar !== _entry.label
            return (
              <Cell
                key={`cell-${index}`}
                opacity={isShadowed ? 0.3 : 1}
                fill={segmentColors[index % segmentColors.length]}
              />
            )
          })}
          <Label
            width={300}
            position="center"
            content={({ viewBox }: { viewBox: PolarViewBox }) => {
              const { cx, cy } = viewBox
              return <CustomChartLabel cx={cx} cy={cy} labelSetting={chartLabelInfo} />
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
