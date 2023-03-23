import useKoobFetch, { fetchKoobData } from '../../../ds_res/hooks/useKoobFetch'

export type ICountries = {
  customer_country: string
  order_quantity: number
  vol: number
}[]

export function getCountries() {
  return useKoobFetch<ICountries>({
    dimensions: ['customer_country'],
    allFilters: {},
    measures: ['sum(vol)', 'sum(order_quantity)'],
    request: {
      sort: ['-vol']
    }
  })
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
