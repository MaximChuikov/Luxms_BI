import { TChartLabelInfo } from 'src/Base/components/CustomChartLabel'
import Color from 'ds_res/styles/Colors.module.scss'

export const labelSettings: TChartLabelInfo = {
  labelHeader: 'Всего отклонений:',
  labelData: 'XXX'
}

export const data = [
  { label: 'Позитивные отклонения', value: 400, color: Color.positiveTrendChartColor },
  { label: 'Негативные отклонения', value: 300, color: Color.negativeTrendChartColor },
  { label: 'Индикация не предусмотрена', value: 300, color: Color.neutralChartColor }
]
