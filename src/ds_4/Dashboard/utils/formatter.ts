import { ICustomerCompanyResults } from '../controllers/customer-controller'
import { ISmallCard } from '../../../ds_res/components/ManyCards/ManyCards'

export function companiesToCards(companiesResults: ICustomerCompanyResults[]): ISmallCard[] {
  return companiesResults.map((comp) => {
    return {
      title: comp.customer_companyname,
      value: comp.vol.toString(),
      stats: {
        isIncrease: comp.growResult,
        text: `${comp.growNumber} продаж`
      }
    }
  })
}
