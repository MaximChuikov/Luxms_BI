import React, { useMemo } from 'react'
import { CellProps, Column } from 'react-table'
import { TIndicatorsTableRowData } from 'src/Main/containers/IndicatorsTable/types'
import { BarOrAreaChart, Link, Table } from 'src/Base/components'
import Color from 'ds_res/styles/Colors.module.scss'
import { indicatorsTableMock } from 'src/Main/containers/IndicatorsTable/mockData'
import { TCustomChartData } from 'src/Base/components/BarOrAreaChart'
import { BigRightArrowLink } from 'ds_res/icons/BigRightArrowLink'
import styles from './IndicatorsTable.module.scss'

export const indicatorsTableColumns: Column<Partial<TIndicatorsTableRowData>>[] = [
  {
    Header: 'Indicator name',
    accessor: 'var_name' // наименование показателя
  },
  {
    Header: 'Indicator type',
    accessor: 'var_type_name' // наименование типа показателя
  },
  {
    Header: 'Period',
    accessor: 'period' // код характера оценки показателя
  },
  {
    Header: 'Value',
    accessor: 'value' // фактическая величина
  },
  {
    Header: 'Units',
    accessor: 'unit_name' // единицы измерения
  },
  {
    Header: 'Diff indicator',
    accessor: 'diffIndicator' // код характера оценки показателя
  },
  {
    Header: 'Department name',
    accessor: 'department_name' // наименование департамента
  },
  {
    Header: 'Chart data',
    accessor: 'chartData',
    Cell: ({ value, row }: CellProps<Partial<TIndicatorsTableRowData>, TCustomChartData | undefined>) => {
      const indicatorType: number = row.original.indicator_type_id as number
      return value ? (
        <BarOrAreaChart
          isChartTypeArea={false}
          indicatorType={indicatorType}
          chartAreaSettings={{
            width: 490,
            height: 60,
            neutralFill: Color.neutralTrendChartArea,
            neutralStrokeColor: Color.neutralTrendChartColor,
            negativeFill: Color.negativeTrendChartArea,
            negativeStrokeColor: Color.negativeTrendChartColor,
            positiveFill: Color.positiveTrendChartArea,
            positiveStrokeColor: Color.positiveTrendChartColor
          }}
          chartData={value}
        />
      ) : null
    }
  },
  {
    Header: 'Link',
    accessor: 'link',
    // TODO: описать логику перехода на страницу показателя
    Cell: () => (
      <Link href={'/'}>
        <BigRightArrowLink />
      </Link>
    )
  }
]

export const IndicatorsTable = () => {
  // TODO: прикрутить логику прокрутки после появления бека
  const data = useMemo(() => indicatorsTableMock, [])
  const columns = useMemo(() => indicatorsTableColumns, [])
  return (
    <div className={styles.indicatorsTable}>
      <Table<TIndicatorsTableRowData> onClick={() => null} withTHead={false} columns={columns} data={data} />
    </div>
  )
}
