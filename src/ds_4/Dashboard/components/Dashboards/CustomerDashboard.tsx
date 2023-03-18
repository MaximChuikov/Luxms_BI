import React, { useContext } from 'react'
import Autocomplete from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { customerCompanyNames, getCountries, productsVolumes } from '../../controllers/Category'
import { DashboardContext } from '../DashboardProvider'
import style from './dashboard.module.scss'

const CustomerDashboard = () => {
  const dashboard = useContext(DashboardContext)
  const [data, loading] = getCountries()
  const [data1] = customerCompanyNames()
  const [dat2] = productsVolumes()
  console.log('Страны', data[0]?.customer_country)
  console.log('Компании', data1[0]?.customer_companyname)
  console.log('Товары', dat2[0]?.productname)
  const autoArr =
    !loading &&
    data.map((e, index) => {
      return {
        label: e.customer_country,
        id: index
      }
    })
  return (
    <div className={style.dashboardContainer}>
      {loading ? (
        <div>Загрузка....</div>
      ) : (
        <Autocomplete labels={autoArr} onChangeValue={(e) => dashboard.setCountry(e.label)} />
      )}
    </div>
  )
}

export default CustomerDashboard
