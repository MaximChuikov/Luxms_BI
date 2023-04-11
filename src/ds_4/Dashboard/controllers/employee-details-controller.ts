import useKoobFetch, { fetchKoobData } from '../../../ds_res/hooks/useKoobFetch'
import { IAutocompleteText } from '../../../ds_res/components/Autocomplete/Autocomplete'
import { toAutocomplete } from '../../../ds_res/utils/formate'
import { ITableProps } from '../../../ds_res/components/Table/Table'
// eslint-disable-next-line import/no-cycle
import {
  categoriesSalesToTable,
  categoriesSalesVolumesToColoredTable,
  IRoundTableDiagramsData
} from '../utils/EmployeeDetailsFormatter'

export type ILastnames = {
  emp_last_name: string
}[]
export function getLastnamesList(callback: (data: ILastnames) => void = () => {}): [IAutocompleteText[], boolean] {
  const [data, loading] = useKoobFetch<ILastnames>(
    {
      dimensions: ['emp_last_name'],
      allFilters: {},
      measures: [],
      request: {}
    },
    callback
  )
  return [
    Object.keys(data).length !== 0 ? toAutocomplete(data, (el) => el.emp_last_name) : ({} as IAutocompleteText[]),
    loading
  ]
}

export type ICategoriesVolumes = {
  categoryname: string
  vol: number
}[]
export function getCategoriesVolumes(employeeLastname: string): Promise<ICategoriesVolumes> {
  const data = fetchKoobData<ICategoriesVolumes>({
    dimensions: ['categoryname'],
    allFilters: {
      emp_last_name: ['=', employeeLastname]
    },
    measures: ['sum(vol)'],
    request: {
      sort: ['-vol']
    }
  })
  return data
}

export type ICategoriesSalesVolumes = {
  categoryname: string
  vol: number
  units_in_order: number
}[]
export function getCategoriesSalesVolumes(employeeLastname: string): Promise<ICategoriesSalesVolumes> {
  const data = fetchKoobData<ICategoriesSalesVolumes>({
    dimensions: ['categoryname'],
    allFilters: {
      emp_last_name: ['=', employeeLastname]
    },
    measures: ['sum(vol)', 'sum(units_in_order)'],
    request: {
      sort: ['-units_in_order']
    }
  })
  return data
}

export interface IAllEmployeeData {
  coloredDiagrams: IRoundTableDiagramsData
  table: ITableProps
}
export async function getAllEmployeeData(employeeLastname: string): Promise<IAllEmployeeData> {
  const coloredDiagrams = categoriesSalesVolumesToColoredTable(await getCategoriesVolumes(employeeLastname))
  const table = categoriesSalesToTable(await getCategoriesSalesVolumes(employeeLastname))
  return {
    coloredDiagrams,
    table
  }
}
