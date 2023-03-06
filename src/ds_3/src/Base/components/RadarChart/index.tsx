import React from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import Color from 'ds_res/styles/Colors.module.scss'
import { TRadarChartWithLabel, RadarAxisData } from 'src/Base/components/RadarChart/types'
import { RadarLabel } from 'src/Base/components/RadarChart/PolarAngleAxisLabel'
import styles from './RadarChart.module.scss'

export const RadarChartWithLabel = ({ chartData }: TRadarChartWithLabel) => {
  const arrayRefined = (props: any) => {
    const item = { ...props }
    switch (true) {
      case item.index > 2:
        item.x -= 130
        break
      case item.index === 0:
        item.y -= 30
        item.x -= 60
        break
      default:
        break
    }
    return item
  }
  return (
    <ResponsiveContainer aspect={2}>
      <RadarChart className={styles.radarChart} data={chartData}>
        <PolarGrid strokeWidth={3} gridType="polygon" radialLines={false} />
        <PolarAngleAxis
          tick={(props) => {
            console.log(props)
            return <RadarLabel {...arrayRefined(props)} />
          }}
          dataKey={(data: RadarAxisData) => Object.values(data).join()}
        />
        <Radar
          legendType="cross"
          name="Невыполненные"
          strokeWidth={3}
          dataKey="unfulfilledIndicators"
          stroke={Color.negativeTrendChartColor}
          fill={Color.negativeTrendChartColor}
          fillOpacity={0.65}
        />
        <Radar
          name="Все показатели"
          strokeDasharray={'3, 3'}
          strokeWidth={3}
          dataKey="allIndicators"
          stroke={Color.allIndicatorsStroke}
          fill="transparent"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
