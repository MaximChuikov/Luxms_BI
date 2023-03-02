import React, { useEffect } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'
import Color from 'ds_res/styles/Colors.module.scss'
import { LabelsLayer } from 'src/Base/components/RadarChart/LabelsLayer'
import { TRadarChartWithLabel, TRadarAxis, RadarAxisData, TRadarLabel } from 'src/Base/components/RadarChart/types'
import styles from './RadarChart.module.scss'

export const RadarChartWithLabel = ({ width, height, chartData }: TRadarChartWithLabel) => {
  const radarLabelData: TRadarLabel[] = []
  const renderPolarAngleAxis = ({ payload, x, y, cx, cy }: TRadarAxis) => {
    const [perspective, allIndicators, unfulfilledIndicators] = payload.value.split(',')
    const item = {
      perspective,
      allIndicators,
      unfulfilledIndicators,
      coordinates: {
        x,
        y,
        cx,
        cy
      }
    }
    radarLabelData.push(item)
    return <></>
  }
  useEffect(() => {
    const parent = document.querySelector('.recharts-polar-grid-concentric') as HTMLElement
    Array.from(parent.childNodes)
      .reverse()
      .forEach((el: HTMLElement) => parent.appendChild(el)) // изменение порядка отображения многоугольников подложки графика для корректного отображения
  }, [])
  return (
    <div className={styles.offset}>
      <RadarChart className={styles.radarChart} outerRadius={90} width={width} height={height} data={chartData}>
        <PolarGrid strokeWidth={3} gridType="polygon" radialLines={false} polarRadius={[25, 50, 75, 100]} />
        <PolarAngleAxis
          tick={(props) => renderPolarAngleAxis(props)}
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
      <LabelsLayer radarLabelData={radarLabelData} />
    </div>
  )
}
