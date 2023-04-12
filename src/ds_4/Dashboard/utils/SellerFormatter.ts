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
    console.log({
      isIncrease: seller.vol > 2000,
      text: `${seller.vol - 2000} шт.`
    })
    return [
      {
        value: seller.supplier_companyname
      },
      {
        value: seller.order_unitprice,
        postfix: 'руб.'
      },
      {
        value: seller.vol,
        postfix: 'шт.',
        stats: {
          isIncrease: seller.vol > 2000,
          text: `${Math.abs(seller.vol - 2000)} шт.`
        }
      },
      {
        value: seller.emp_year_salary,
        postfix: 'руб.'
      }
    ]
  })
  return result
}
