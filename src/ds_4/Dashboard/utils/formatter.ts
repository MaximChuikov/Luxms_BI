// eslint-disable-next-line import/no-cycle
import { ICountries, ICustomerCompanyResults, IProductVolumes } from '../controllers/customer-controller'
import { ISmallCard } from '../../../ds_res/components/ManyCards/SmallCard'
import { IRoundDiagramData } from '../../../ds_res/components/ColoredDiagrams/RoundDiagram/RoundDiagram'
import { IAutocompleteText } from '../../../ds_res/components/Autocomplete/Autocomplete'
import { IColoredTableData } from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'

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

export function convertProductsToRoundDiagramData(products: IProductVolumes): IRoundDiagramData {
  const result = {} as IRoundDiagramData
  result.diagram = products.map((pr) => {
    return {
      value: pr.vol
    }
  })
  const allVol = products.map((pr) => pr.vol).reduce((pr, curr) => pr + curr)
  result.centerDiagram = {
    title: 'Всего продаж',
    value: allVol,
    stats: {
      isIncrease: allVol > 150000,
      text: '11% к 2008 году'
    }
  }
  result.valuePostfix = 'шт.'
  return result
}

export function convertProductsToTableData(products: IProductVolumes): IColoredTableData {
  const result = {} as IColoredTableData
  result.diagram = products.map((pr) => {
    return {
      title: pr.productname,
      value: pr.vol,
      stats: {
        isIncrease: pr.vol > 8000,
        text: '21% к 2008 году'
      }
    }
  })
  result.valuePostfix = 'шт.'
  return result
}

export function countriesArrToAutocomplete(countries: ICountries): IAutocompleteText[] {
  return countries.map((country, index) => {
    return {
      label: country.customer_country,
      id: index
    }
  })
}
