import { TChartLabelInfo } from 'src/Base/components/CustomChartLabel'

export const options = [
  { label: 'Все перспективы оценки' },
  { label: 'Безопасность и надежность' },
  { label: 'Клиенты и рынки' },
  { label: 'Технологические процессы' },
  { label: 'Экономика и финансы' },
  { label: 'Персонал и развитие' }
]

export const labelSettings: TChartLabelInfo = {
  labelHeader: 'Всего отклонений:',
  labelData: 'XXX'
}

export const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 }
]
