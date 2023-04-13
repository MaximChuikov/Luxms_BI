import { IColoredTableData } from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
// eslint-disable-next-line import/no-cycle
import { ICategoriesSalesVolumes, ICategoriesVolumes } from '../controllers/employee-details-controller'
import { ITableProps } from '../../../ds_res/components/Table/Table'
import { IRoundDiagramData } from '../../../ds_res/components/ColoredDiagrams/RoundDiagram/RoundDiagram'

export interface IRoundTableDiagramsData {
  table: IColoredTableData
  round: IRoundDiagramData
}
export function categoriesSalesVolumesToColoredTable(sales: ICategoriesVolumes): IRoundTableDiagramsData {
  const table = {} as IColoredTableData
  table.diagram = sales.map((sale) => {
    return {
      title: sale.categoryname,
      value: sale.vol,
      stats: {
        isIncrease: sale.vol > 10000,
        text: `${Math.abs(sale.vol - 10000)}`
      }
    }
  })
  table.valuePostfix = 'шт.'

  const round = {} as IRoundDiagramData
  round.diagram = sales.map((sale) => {
    return {
      value: sale.vol
    }
  })
  round.valuePostfix = 'шт.'
  const totalSales = sales.map((sale) => sale.vol).reduce((a, b) => a + b)
  round.centerDiagram = {
    title: `Всего продаж`,
    value: totalSales,
    stats: {
      isIncrease: totalSales < 3000,
      text: `${totalSales - 3000} продаж от нормы`
    }
  }
  return {
    table,
    round
  }
}

export function categoriesSalesToTable(sellersStats: ICategoriesSalesVolumes): ITableProps {
  const result = {} as ITableProps
  result.headers = ['Категория', 'Стоимость продаж', 'Объем продаж']
  result.tableData = sellersStats.map((seller) => {
    return {
      isIncrease: seller.units_in_order > 4000,
      columns: [
        {
          value: seller.categoryname
        },
        {
          value: seller.units_in_order,
          postfix: 'руб.',
          stats: {
            isIncrease: seller.units_in_order > 4000,
            text: `${seller.units_in_order - 4000} руб.`
          }
        },
        {
          value: seller.vol,
          postfix: 'шт.'
        }
      ]
    }
  })
  return result
}
