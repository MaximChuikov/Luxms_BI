import React from 'react'
import { TBarSVGFragment } from 'src/Base/components/StackedBarChart/types'
import styles from './BarSVGFragment.module.scss'

export const BarSVGFragment = ({
  horizontallyOriented,
  indicatorType,
  selectedDeviationType,
  fragmentWidth,
  chartHeight,
  fill,
  values: { positiveIndicators, neutralIndicators, negativeIndicators }
}: TBarSVGFragment) => {
  const allValuesSummary = positiveIndicators + neutralIndicators + negativeIndicators
  const getWidth = (value: number) => chartHeight * (value / allValuesSummary)
  const getPercents = (indicator: string) => {
    switch (indicator) {
      case 'negativeIndicators':
        return ((negativeIndicators * 100) / allValuesSummary).toFixed(1).concat(' %')
      case 'neutralIndicators':
        return ((neutralIndicators * 100) / allValuesSummary).toFixed(1).concat(' %')
      case 'positiveIndicators':
        return ((positiveIndicators * 100) / allValuesSummary).toFixed(1).concat(' %')
      default:
        return null
    }
  }
  const getBarSVGFragmentsParams = (indicator: string, isVertical: boolean) => {
    switch (indicator) {
      case 'negativeIndicators':
        return isVertical
          ? [0, 0, getWidth(negativeIndicators), fragmentWidth]
          : [0, chartHeight - getWidth(negativeIndicators), fragmentWidth, getWidth(negativeIndicators)]
      case 'positiveIndicators':
        return isVertical
          ? [selectedDeviationType ? 0 : getWidth(negativeIndicators), 0, getWidth(positiveIndicators), fragmentWidth]
          : [
              0,
              selectedDeviationType
                ? chartHeight - getWidth(positiveIndicators)
                : chartHeight - getWidth(negativeIndicators + positiveIndicators),
              fragmentWidth,
              getWidth(positiveIndicators)
            ]
      case 'neutralIndicators':
        return isVertical
          ? [
              selectedDeviationType ? 0 : getWidth(positiveIndicators + negativeIndicators),
              0,
              getWidth(neutralIndicators),
              fragmentWidth
            ]
          : [
              0,
              selectedDeviationType
                ? getWidth(positiveIndicators + negativeIndicators)
                : chartHeight - getWidth(allValuesSummary),
              fragmentWidth,
              getWidth(neutralIndicators)
            ]
      default:
        return [0, 0, 0, 0]
    }
  }
  const [x, y, width, height] = getBarSVGFragmentsParams(indicatorType, horizontallyOriented)
  return (
    <g>
      <rect name={indicatorType} fill={fill} height={height} x={x} y={y} width={width} />
      <foreignObject x={x} y={y} width={width} height={height}>
        <div className={styles.persentageValueInBar}>{getPercents(indicatorType)}</div>
      </foreignObject>
    </g>
  )
}
