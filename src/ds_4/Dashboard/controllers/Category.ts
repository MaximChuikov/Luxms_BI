import { KoobDataService } from 'bi-internal/services'

const { koobDataRequest3 } = KoobDataService

export async function getEmployeeTitles() {
  const data = await koobDataRequest3('luxmsbi.Sales_Demo', ['emp_title'], [], [], {}, 'category name')
  return data
}

export async function helo() {
  const data = await koobDataRequest3('luxmsbi.Sales_Demo', ['sum(empid)'], [], [], {}, 'category name')
  return data
}
