import { IColoredTableData } from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
// eslint-disable-next-line import/no-cycle
import { IBestSellers, ICategoryStats, ISellersStats } from '../controllers/seller-controller'
import { ICardsProps } from '../../../ds_res/components/BigCards/Cards'
import { ITableProps } from '../../../ds_res/components/Table/Table'

export function sellersStatsToColoredTable(sellers: IBestSellers): IColoredTableData {
  const result = {} as IColoredTableData
  result.diagram = sellers.map((seller) => {
    return {
      title: seller.supplier_companyname,
      value: seller.vol,
      stats: {
        isIncrease: seller.vol > 8000,
        text: '21% к 2008 году'
      }
    }
  })
  result.valuePostfix = 'шт.'
  return result
}

export function categoryStatsToCard(categoryStats: ICategoryStats): ICardsProps {
  const result = {} as ICardsProps
  result.cardsData = categoryStats.map((cat) => {
    return {
      title: cat.categoryname,
      value: `${cat.vol.toString()} продаж`,
      stats: {
        isIncrease: cat.vol > 8000,
        text: '21% к 2008 году'
      }
    }
  })
  return result
}

export function sellersStatsToTable(sellersStats: ISellersStats): ITableProps {
  const result = {} as ITableProps
  result.headers = ['Компания', 'Стоимость продаж', 'Объем продаж', 'Выплата зарплат']
  result.tableData = sellersStats.map((seller) => {
    return [
      seller.supplier_companyname,
      `${seller.order_unitprice} руб.`,
      `${seller.vol} шт.`,
      `${seller.emp_year_salary} руб.`
    ]
  })
  return result
}
