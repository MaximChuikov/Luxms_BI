import React from 'react'
import { TBarSVG } from 'src/Base/components/StackedBarChart/types'
import { hideIfBarSelected } from 'src/Base/components/StackedBarChart/utils/hideIfBarSelected'
import Color from 'ds_res/styles/Colors.module.scss'
import { BarSVGFragment } from 'src/Base/components/StackedBarChart/BarSVGFragment'

export const BarSVG = ({ data, selectedDeviationType, horizontallyOriented, barSize }: TBarSVG) => {
  const { positiveIndicators = 0, negativeIndicators = 0, neutralIndicators = 0, x = 0, y = 0, background } = data
  const { height, width } = background
  const chartHeight = horizontallyOriented ? width : height
  return (
    <svg x={x} y={horizontallyOriented ? y : background.y}>
      {selectedDeviationType && (
        <>
          {horizontallyOriented ? (
            <g>
              <rect name="barBackground" fill={Color.pageBackground} height={barSize} x={0} width={chartHeight} />
            </g>
          ) : (
            <g>
              <rect
                name="barBackground"
                fill={Color.pageBackground}
                height={chartHeight - background.y}
                y={background.y}
                width={barSize}
              />
            </g>
          )}
        </>
      )}
      {hideIfBarSelected('negativeIndicators', selectedDeviationType) && (
        <BarSVGFragment
          horizontallyOriented={horizontallyOriented}
          chartHeight={chartHeight}
          fill={Color.negativeTrendChartColor}
          fragmentWidth={barSize}
          indicatorType="negativeIndicators"
          selectedDeviationType={selectedDeviationType}
          values={{ positiveIndicators, neutralIndicators, negativeIndicators }}
        />
      )}
      {hideIfBarSelected('positiveIndicators', selectedDeviationType) && (
        <BarSVGFragment
          horizontallyOriented={horizontallyOriented}
          chartHeight={chartHeight}
          fill={Color.positiveTrendChartColor}
          fragmentWidth={barSize}
          indicatorType="positiveIndicators"
          selectedDeviationType={selectedDeviationType}
          values={{ positiveIndicators, neutralIndicators, negativeIndicators }}
        />
      )}
      {hideIfBarSelected('neutralIndicators', selectedDeviationType) && (
        <BarSVGFragment
          horizontallyOriented={horizontallyOriented}
          chartHeight={chartHeight}
          fill={Color.neutralChartColor}
          fragmentWidth={barSize}
          indicatorType="neutralIndicators"
          selectedDeviationType={selectedDeviationType}
          values={{ positiveIndicators, neutralIndicators, negativeIndicators }}
        />
      )}
    </svg>
  )
}
