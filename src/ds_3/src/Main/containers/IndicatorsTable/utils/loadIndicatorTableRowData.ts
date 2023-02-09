import { TPeriodValues } from 'src/Base/components/BarOrAreaChart'
import { TABLE_KOOB_ID } from 'src/Base/constants/stringConstants'
import { getIndicatorArrowWithSign, getTablePeroidByDateAndValTypes, loadData } from 'src/Base/utils/common'
import {
  TFilterValidation,
  TIndicatorsTableRowData,
  TLoadDataFilter,
  TSkimItColumns,
  TSkimItWindow
} from 'src/Main/containers/IndicatorsTable/types'

const requestColumns: TSkimItColumns = [
  'direction_type_id',
  'department_id',
  'department_name',
  'var_type_name', // столбец 2: все мониторинг контроль исп
  'metric_type_id', //
  'var_id',
  'var_name',
  'indicator_type_id',
  'val_type_name', // тип данных (нарастающий итог/итог)
  'date_type_id', // дискретность данных (сутки/месяц/год)
  'unit_name' // единица измерения
]

const filters: TFilterValidation<TSkimItWindow> | TLoadDataFilter = {
  date_type_id: ['2'], // берём месяцы
  direction_type_id: ['0'], // первая вкладка главной страницы (все перспективы оценки)
  var_id: [''] // prepareRowDataRofIndicatorsTable работает только для одного показателя
}

export const prepareRowDataForIndicatorsTable = (data: Array<Partial<TSkimItWindow>>) => {
  const { var_name, var_type_name, date_type_id, unit_name, val_type_id, department_name, indicator_type_id } = data[0]
  const rowObject: TIndicatorsTableRowData = {
    var_name,
    var_type_name,
    date_type_id,
    value: 0,
    unit_name,
    department_name,
    indicator_type_id,
    link: '',
    diffIndicator: [''],
    chartData: [],
    period: ''
  }
  const chartByDataMap = data.reduce((a: Map<string, TPeriodValues>, c) => {
    const date = c.date as string
    const planFactPair = a.get(date) || ({} as TPeriodValues)
    if (c.metric_type_id !== 2) {
      planFactPair.planValue = c.value as number
      a.set(date, planFactPair)
    } else {
      planFactPair.actualValue = c.value as number
      a.set(date, planFactPair)
    }
    return a
  }, new Map()) as Map<string, TPeriodValues>
  rowObject.chartData = [...chartByDataMap].map(([, value]) => value)
  rowObject.value = rowObject.chartData[rowObject.chartData.length - 1].actualValue
  rowObject.diffIndicator = getIndicatorArrowWithSign(
    indicator_type_id as number,
    rowObject.chartData[rowObject.chartData.length - 1].planValue
  )
  rowObject.period = getTablePeroidByDateAndValTypes(
    data[data.length - 1].date as string,
    date_type_id as number,
    val_type_id as number
  ) as string
  return rowObject
}

export const loadIndicatorTableRowData = async (departmentId: string, varId: string) => {
  filters.department_id = ['=', departmentId]
  filters.var_type_id = ['=', varId]
  // TODO указать аргумент сортировки по дате
  const data = await loadData(TABLE_KOOB_ID, requestColumns, filters as TLoadDataFilter)
  return prepareRowDataForIndicatorsTable(data)
}
