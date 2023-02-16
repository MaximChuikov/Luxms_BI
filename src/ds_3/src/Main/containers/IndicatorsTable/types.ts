import { TCustomChartData } from 'src/Base/components/BarOrAreaChart'

export type TSkimItWindow = {
  date: string
  query_date: Date
  date_type_id: number
  date_type_name: string
  org_id: number
  org_name: string
  unit_id: number
  unit_name: string
  val_type_id: number
  val_type_name: string
  metric_type_id: number
  metric_type_name: string
  var_id: number
  var_name: string
  value: number
  var_level_id: number
  var_level_name: string
  var_type_id: number
  var_type_name: string
  direction_type_id: number
  direction_type_name: string
  indicator_type_id: number
  indicator_type_name: string
  department_id: number
  department_name: string
}

export type TFilterValidation<T> = {
  [K in keyof Partial<T>]: string[]
}

export type TLoadDataFilter = {
  [K in keyof TSkimItWindow]: string[]
}

export const METRIC_TYPE = {
  PLAN: '1',
  FACT: '2',
  ABSOLUTE_DEVIATION: '12',
  RELATIVE_DEVIATION: '10'
}

export type TSkimItColumns = Array<keyof TSkimItWindow>

export type TIndicatorsTableRowData = Partial<TSkimItWindow> & {
  link: string
  chartData: TCustomChartData
  diffIndicator: string[]
  period: string
}

export type TLoadDataParams = {
  koobId: string
  columns?: TSkimItColumns
  filters?: TFilterValidation<TSkimItWindow>
  comment?: string
  distinct?: string | never[]
  limit?: number
  sort?: string[]
}

export type TRequestBody = Omit<TLoadDataParams, 'koobId' | 'comment'> & {
  with: string
}
