export type TStackedBarChartData = {
  label: string
  positiveIndicators?: number
  negativeIndicators?: number
  neutralIndicators?: number
}

export type TSelectedIndicatorBar = keyof Omit<TStackedBarChartData, 'label'> | '' | 'allIndicators'
export type TStackedBarChart = {
  chartData: TStackedBarChartData[]
  isRelative: boolean
  horizontallyOriented: boolean
  selectedBar: TSelectedIndicatorBar
}

export type TStackedBarExtendedChartData = TStackedBarChartData & {
  background: { width: number; height: number; y: number }
  x: number
  y: number
} & { [key: string]: any }

export type TBarSVGFragment = {
  horizontallyOriented: boolean
  indicatorType: keyof Omit<TStackedBarChartData, 'label'>
  selectedDeviationType: keyof Omit<TStackedBarChartData, 'label'> | ''
  fragmentWidth: number
  fill: string
  chartHeight: number
  values: {
    positiveIndicators: number
    neutralIndicators: number
    negativeIndicators: number
  }
}

export type TBarSVG = {
  data: TStackedBarExtendedChartData
  selectedDeviationType: keyof Omit<TStackedBarChartData, 'label'> | ''
  horizontallyOriented: boolean
  barSize: number
}
