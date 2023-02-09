import { TSkimItColumns, TRequestBody, TLoadDataFilter } from 'src/Main/containers/IndicatorsTable/types'
// eslint-disable-next-line import/no-duplicates
import { format, getISOWeek, getQuarter, startOfQuarter, startOfWeek, startOfYear } from 'date-fns'
import { TChartAreaSettings } from 'src/Base/components/BarOrAreaChart'
// eslint-disable-next-line import/no-duplicates
import ru from 'date-fns/locale/ru'

export enum DateType {
  year = 1,
  month,
  week,
  day,
  quarter,
  halfYear
}

export enum IndicatorType {
  all = 0,
  straight,
  opposite,
  neutral
}

export enum ValType {
  cumulativeFromYearStartByMonth = 2,
  cumulativeFromHalfYearStartByMonth,
  cumulativeFromQuarterStartByMonth,
  cumulativeFromYearStartByDay,
  cumulativeFromHalfYearStartByDay,
  cumulativeFromQuarterStartByDay,
  cumulativeFromMonthStartByDay,
  cumulativeFromWeekStartByDay
}

export const loadData = (
  koobId: string,
  columns: TSkimItColumns,
  filters: TLoadDataFilter,
  comment?: string,
  distinct?: string,
  limit?: number,
  sort?: string[]
) => {
  const VALID_OPS = ['=', '!=', 'BETWEEN', '>=']

  const filtersToValidate = filters ? { ...filters } : ({} as TLoadDataFilter)
  Object.keys(filtersToValidate).forEach((key: keyof TLoadDataFilter) => {
    // пофиксаем фильтры (они часто без знака '=' в начале)
    if (Array.isArray(filtersToValidate[key]) && !VALID_OPS.includes(filtersToValidate[key][0])) {
      filtersToValidate[key] = ['='].concat(filtersToValidate[key])
    } else if (typeof filtersToValidate[key] === 'string' || typeof filtersToValidate[key] === 'number') {
      filtersToValidate[key] = ['=', ...filtersToValidate[key]]
    } else if (filtersToValidate[key] === null) {
      // выглядит странно, может надо удалить из columns? А вдруг не надо? sns_name может быть null, например.
      delete filtersToValidate[key] // но с другой стороны у нас state возвращает null, если не нашел ключ в url, так что тут все правильно
    }
  })

  const body: TRequestBody = {
    with: koobId,
    distinct: !!distinct && distinct.length ? distinct : [],
    columns,
    filters: filters || {}
  }
  if (limit) body.limit = limit
  if (sort) body.sort = sort

  let url = '/api/v3/koob/data'
  if (comment) url += `?${comment}`

  return fetch(url, {
    headers: {
      // 'accept': 'application/stream+json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors',
    credentials: 'include'
  }).then((response) => response.json())
}

export const getIndicatorArrowWithSign = (indicatorType: number, value: number) => {
  if (value === 0 || indicatorType === IndicatorType.neutral) return ['', '']
  switch (indicatorType) {
    case IndicatorType.all:
      return value > 0 ? ['▲', '-'] : ['▼', '-']
    case IndicatorType.straight:
      return value > 0 ? ['▲', '+'] : ['▼', '-']
    case IndicatorType.opposite:
      return value > 0 ? ['▲', '-'] : ['▼', '+']
    default:
      return ['', '']
  }
}

export const getAreaColors = (indicatorType: number, chartSettings: TChartAreaSettings, gap: number) => {
  const positiveFill = [chartSettings.positiveStrokeColor, chartSettings.positiveFill]
  const negativeFill = [chartSettings.negativeStrokeColor, chartSettings.negativeFill]
  if (indicatorType === IndicatorType.neutral) {
    return [chartSettings.neutralStrokeColor, chartSettings.neutralFill]
  }
  switch (indicatorType) {
    case IndicatorType.all:
      return gap === 0 ? positiveFill : negativeFill
    case IndicatorType.straight:
      return gap > 0 ? positiveFill : negativeFill
    case IndicatorType.opposite:
      return gap < 0 ? positiveFill : negativeFill
    default:
      return []
  }
}

export const getPeriod = (date: string, valType: number) => {
  const dateFormatted = date.split(' ')[0].split('-').reverse().join(' ')
  const givenDate = new Date(date)
  const halfYearStart =
    givenDate.getMonth() + 1 > 6
      ? '01 07 '.concat(String(givenDate.getFullYear()))
      : '01 01 '.concat(String(givenDate.getFullYear()))
  switch (valType) {
    case ValType.cumulativeFromYearStartByMonth:
    case ValType.cumulativeFromYearStartByDay:
      return startOfYear(givenDate).toLocaleDateString().split('.').join(' ').concat(' -\n', dateFormatted)
    case ValType.cumulativeFromHalfYearStartByMonth:
    case ValType.cumulativeFromHalfYearStartByDay:
      return halfYearStart.concat(' -\n', dateFormatted)
    case ValType.cumulativeFromQuarterStartByMonth:
    case ValType.cumulativeFromQuarterStartByDay:
      return startOfQuarter(givenDate).toLocaleDateString().split('.').join(' ').concat(' -\n', dateFormatted)
    case ValType.cumulativeFromMonthStartByDay:
      return '01'.concat(dateFormatted.slice(3)).concat(' -\n', dateFormatted)
    case ValType.cumulativeFromWeekStartByDay:
      return startOfWeek(givenDate, { weekStartsOn: 1 })
        .toLocaleDateString()
        .split('.')
        .join(' ')
        .concat(' -\n', dateFormatted)
    default:
      return ''
  }
}

export const getTablePeroidByDateAndValTypes = (date: string, dateTypeId: number, valTypeId: number) => {
  // Формат date - ГГГГ-ММ-ДД ЧЧ:мм:СС
  const givenDate = new Date(date)
  if (valTypeId !== 1) getPeriod(date, valTypeId)
  switch (dateTypeId) {
    case DateType.year:
      return date.split('-')[0].concat('год (итог)')
    case DateType.month:
      return format(new Date(2000, +date.split('-')[1], 1), 'LLLL', { locale: ru }).concat(' (итог)')
    case DateType.week:
      return ''.concat(String(getISOWeek(givenDate)), ' неделя (итог)')
    case DateType.day:
      return format(new Date(2000, +date.split('-')[1], 1), 'LLLL', { locale: ru }).concat(
        ', ',
        date.split('-')[3],
        ' (итог)'
      )
    case DateType.quarter:
      return String(getQuarter(givenDate)).concat(' квартал (итог)')
    case DateType.halfYear:
      return String(getQuarter(givenDate) > 2 ? '2' : '1').concat(' полугодие (итог)')
    default:
      return null
  }
}
