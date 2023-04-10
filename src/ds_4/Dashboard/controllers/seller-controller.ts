import useKoobFetch, { fetchKoobData } from '../../../ds_res/hooks/useKoobFetch'
import { IAutocompleteText } from '../../../ds_res/components/Autocomplete/Autocomplete'
// eslint-disable-next-line import/no-cycle
import { categoryStatsToCard, sellersStatsToColoredTable, sellersStatsToTable } from '../utils/SellerFormatter'
import { IColoredTableData } from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
import { ICardsProps } from '../../../ds_res/components/BigCards/Cards'
import { toAutocomplete } from '../../../ds_res/utils/formate'
import { ITableProps } from '../../../ds_res/components/Table/Table'

export type ICategories = {
  categoryname: string
}[]
export function getCategoriesList(callback: (data: ICategories) => void = () => {}): [IAutocompleteText[], boolean] {
  const [data, loading] = useKoobFetch<ICategories>(
    {
      dimensions: ['categoryname'],
      allFilters: {},
      measures: [],
      request: {
        sort: []
      }
    },
    callback
  )
  return [
    Object.keys(data).length !== 0 ? toAutocomplete(data, (el) => el.categoryname) : ({} as IAutocompleteText[]),
    loading
  ]
}

export type ICategoryStats = {
  categoryname: string
  vol: number
  units_in_order: number
}[]
export async function getCategoryStats(category: string): Promise<ICategoryStats> {
  const data = await fetchKoobData<ICategoryStats>({
    dimensions: ['categoryname'],
    allFilters: {
      categoryname: ['=', category]
    },
    request: {},
    measures: ['sum(vol)', 'sum(units_in_order)']
  })
  return data
}

export type IBestSellers = {
  supplier_companyname: string
  vol: number
}[]
export async function getBestSellers(category: string): Promise<IBestSellers> {
  const data = await fetchKoobData<IBestSellers>({
    dimensions: ['supplier_companyname'],
    allFilters: {
      categoryname: ['=', category]
    },
    request: {
      sort: ['-vol']
    },
    measures: ['sum(vol)']
  })
  return data
}

export type ISellersStats = {
  supplier_companyname: string
  order_unitprice: number
  vol: number
  emp_year_salary: number
}[]
export async function getSellersStatsArray(category: string): Promise<ISellersStats> {
  const data = await fetchKoobData<ISellersStats>({
    dimensions: ['supplier_companyname'],
    allFilters: {
      categoryname: ['=', category]
    },
    request: {
      sort: ['-order_unitprice']
    },
    measures: ['sum(order_unitprice)', 'sum(vol)', 'sum(emp_year_salary)']
  })
  const result = data.map((row) => {
    const r = row
    r.order_unitprice = Math.trunc(row.order_unitprice * 100) / 100
    return r
  })
  return result
}

export interface IAllSellerData {
  sellersStats: ITableProps
  bestSellers: IColoredTableData
  categoryStats: ICardsProps
}
export async function getAllSellersData(category: string): Promise<IAllSellerData> {
  const sellerStats = sellersStatsToTable(await getSellersStatsArray(category))
  const bestSellers = sellersStatsToColoredTable(await getBestSellers(category))
  const categoryStats = categoryStatsToCard(await getCategoryStats(category))
  return {
    bestSellers,
    categoryStats,
    sellersStats: sellerStats
  }
}
