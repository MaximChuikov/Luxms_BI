import useKoobFetch, { fetchKoobData } from '../../../ds_res/hooks/useKoobFetch'
// eslint-disable-next-line import/no-cycle
import { countriesArrToAutocomplete } from '../utils/formatter'
import { IAutocompleteText } from '../../../ds_res/components/Autocomplete/Autocomplete'

export type ICountries = {
  customer_country: string
  vol: number
}[]

export function getCountries(callback: (data: ICountries) => void = () => {}): [IAutocompleteText[], boolean] {
  const [data, loading] = useKoobFetch<ICountries>(
    {
      dimensions: ['customer_country'],
      allFilters: {},
      measures: ['sum(vol)'],
      request: {
        sort: ['-vol']
      }
    },
    callback
  )
  return [Object.keys(data).length !== 0 ? countriesArrToAutocomplete(data) : ({} as IAutocompleteText[]), loading]
}

export type IProductVolumes = {
  productname: string
  vol: number
}[]

export async function getProductsVolumes(county: string): Promise<IProductVolumes> {
  const data = await fetchKoobData<IProductVolumes>({
    dimensions: ['productname'],
    allFilters: {
      supplier_country: ['=', county]
    },
    request: {
      sort: ['-vol']
    },
    measures: ['sum(vol)']
  })
  return data
}

export interface ICustomerCompanyResults {
  customer_companyname: string
  vol: number
  growResult: boolean
  growNumber: number
}
interface ICompanyResults {
  customer_companyname: string
  vol: number
}
export async function getCustomerCompanyNames(county: string): Promise<ICustomerCompanyResults[]> {
  // TODO: в бд последняя дата 2007 07 30, изменить currentDate на текущую
  const currentDate = new Date('2006-06-01')
  const minusFourMonths = new Date(currentDate.getTime())
  const minusTwoMonths = new Date(currentDate.getTime())
  minusFourMonths.setMonth(minusFourMonths.getMonth() - 4)
  minusTwoMonths.setMonth(minusTwoMonths.getMonth() - 2)

  const companies: ICustomerCompanyResults[] = await fetchKoobData({
    dimensions: ['customer_companyname'],
    allFilters: {
      supplier_country: ['=', county],
      order_date: ['and', ['>=', minusFourMonths], ['<=', currentDate]]
    },
    request: {
      sort: ['-vol'],
      limit: 12
    },
    measures: ['sum(vol)']
  })
  // eslint-disable-next-line no-restricted-syntax
  for (const company of companies) {
    // eslint-disable-next-line no-await-in-loop
    const oldStats = await fetchKoobData<ICompanyResults[]>({
      dimensions: ['customer_companyname'],
      allFilters: {
        customer_companyname: ['=', company.customer_companyname],
        order_date: ['and', ['>=', minusFourMonths], ['<=', minusTwoMonths]]
      },
      measures: ['sum(vol)']
    })
    // eslint-disable-next-line no-await-in-loop
    const newStats = await fetchKoobData<ICompanyResults[]>({
      dimensions: ['customer_companyname'],
      allFilters: {
        customer_companyname: ['=', company.customer_companyname],
        order_date: ['and', ['>=', minusTwoMonths], ['<=', currentDate]]
      },
      measures: ['sum(vol)']
    })
    const newVal = newStats[0]?.vol ?? 0
    const oldVal = oldStats[0]?.vol ?? 0
    company.growResult = newVal > oldVal
    company.growNumber = newVal - oldVal
  }
  return companies
}

export interface IAllCustomerData {
  products: IProductVolumes
  companies: ICustomerCompanyResults[]
}
export async function getAllDashboardData(country: string): Promise<IAllCustomerData> {
  const products = await getProductsVolumes(country)
  const companies = await getCustomerCompanyNames(country)
  return {
    products,
    companies
  }
}
