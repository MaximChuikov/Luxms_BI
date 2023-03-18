import useFetch from '../../../ds_res/hooks/useFetch'

export function getCountries() {
  return useFetch<
    {
      customer_country: string
      order_quantity: number
      vol: number
    }[]
  >({
    dimensions: ['customer_country'],
    allFilters: {},
    measures: ['sum(vol)', 'sum(order_quantity)'],
    request: {
      sort: ['-vol']
    }
  })
}

export function productsVolumes() {
  return useFetch<
    {
      productname: string
      vol: number
    }[]
  >({
    dimensions: ['productname'],
    allFilters: {},
    measures: ['sum(vol)']
  })
}

export function customerCompanyNames() {
  return useFetch<
    {
      customer_companyname: string
      vol: number
    }[]
  >({
    dimensions: ['customer_companyname'],
    allFilters: {},
    measures: ['sum(vol)']
  })
}
