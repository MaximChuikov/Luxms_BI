import React from 'react'
import styles from './CustomChartLabel.module.scss'

type TCustomChartLabel = {
  cx: number
  cy: number
  labelSetting: TChartLabelInfo
}

export type TChartLabelInfo = {
  labelHeader: string
  labelData?: string
}

export const CustomChartLabel = ({ cx, cy, labelSetting }: TCustomChartLabel) => {
  const { labelHeader, labelData } = labelSetting
  return (
    <>
      <>
        {labelHeader.split(' ').map((text, index) => (
          <text key={text} x={cx} y={cy - 30 + 15 * index} textAnchor="middle" dominantBaseline="central">
            <tspan className={styles.chartLabelDescription} alignmentBaseline="middle" fontSize="14px">
              {text}
            </tspan>
          </text>
        ))}
      </>
      {labelData ? (
        <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="central">
          <tspan className={styles.chartLabelValue} fontSize="30px">
            {labelData}
          </tspan>
        </text>
      ) : null}
    </>
  )
}
