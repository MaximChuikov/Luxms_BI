import React from 'react'
import useFetch from '../../../../ds_res/utils/useFetch'

const CustomerDashboard = () => {
  const [data] = useFetch({
    dimensions: ['customer_country'],
    allFilters: {},
    measures: ['sum(vol)', 'sum(order_quantity)'],
    request: {
      sort: ['-vol'],
      limit: 5
    }
  })
  const [data1] = useFetch({
    dimensions: ['customer_companyname'],
    allFilters: {},
    measures: ['sum(vol)']
  })
  const [dat2] = useFetch({
    dimensions: ['productname'],
    allFilters: {},
    measures: ['sum(vol)']
  })
  console.log('Страны', data)
  console.log('Компании', data1)
  console.log('Товары', dat2)
  return <div />
}

export default CustomerDashboard
