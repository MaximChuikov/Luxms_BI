import React from 'react'
import { TBarSVG, TStackedBarChartData } from 'src/Base/components/StackedBarChart/types'
import { hideIfBarSelected } from 'src/Base/components/StackedBarChart/utils/hideIfBarSelected'
import Color from 'ds_res/styles/Colors.module.scss'
import { BarSVGFragment } from 'src/Base/components/StackedBarChart/BarSVGFragment'
import styles from './BarSVG.module.scss'

export const BarSVG = ({ data, selectedDeviationType, horizontallyOriented }: TBarSVG) => {
  const { positiveIndicators = 0, negativeIndicators = 0, neutralIndicators = 0, x = 0, y = 0, background } = data
  const { height, width } = background
  const chartHeight = horizontallyOriented ? width : height
  const barSize = horizontallyOriented ? data.height : data.width
  const barArray: Array<{ color: string; type: keyof Omit<TStackedBarChartData, 'label'> }> = [
    { color: Color.negativeTrendChartColor, type: 'negativeIndicators' },
    { color: Color.positiveTrendChartColor, type: 'positiveIndicators' },
    { color: Color.neutralChartColor, type: 'neutralIndicators' }
  ]
  return (
    <svg x={x} y={horizontallyOriented ? y : background.y}>
      <>
        {selectedDeviationType && (
          <g>
            {horizontallyOriented ? (
              <rect name="barBackground" className={styles.barContainer} height={barSize} x={0} width={chartHeight} />
            ) : (
              <rect
                className={styles.barContainer}
                name="barBackground"
                height={chartHeight - background.y}
                y={background.y}
                width={barSize}
              />
            )}
          </g>
        )}
        {barArray.map((barFragment) => (
          <>
            {hideIfBarSelected(barFragment.type, selectedDeviationType) && (
              <BarSVGFragment
                horizontallyOriented={horizontallyOriented}
                chartHeight={chartHeight}
                fill={barFragment.color}
                fragmentWidth={barSize}
                indicatorType={barFragment.type}
                selectedDeviationType={selectedDeviationType}
                values={{ positiveIndicators, neutralIndicators, negativeIndicators }}
              />
            )}
          </>
        ))}
      </>
    </svg>
  )
}
