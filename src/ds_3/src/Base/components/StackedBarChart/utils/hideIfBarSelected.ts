import { TStackedBarChartData } from 'src/Base/components/StackedBarChart/types'

export const hideIfBarSelected = (
  barName: keyof Omit<TStackedBarChartData, 'label'>,
  selectedBar: keyof Omit<TStackedBarChartData, 'label'> | '' | 'allIndicators'
) => {
  if (!selectedBar) return true
  return selectedBar === barName
}
