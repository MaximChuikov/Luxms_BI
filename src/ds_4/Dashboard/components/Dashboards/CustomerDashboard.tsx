import React, { useContext, useEffect, useState } from 'react'
import Autocomplete from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { getAllDashboardData, getCountries, IAllCustomerData } from '../../controllers/customer-controller'
import { DashboardContext } from '../DashboardProvider'
import ManyCards from '../../../../ds_res/components/ManyCards/ManyCards'
import { companiesToCards } from '../../utils/formatter'
import style from './dashboard.module.scss'

const CustomerDashboard = () => {
  const dashboard = useContext(DashboardContext)
  const [countries, countriesLoading] = getCountries()
  const [dashboardData, setDashboardData] = useState({} as IAllCustomerData)
  const [dataLoading, setDataLoading] = useState(true)
  useEffect(() => {
    async function fetch() {
      const country = dashboard.getCountry()
      const data = await getAllDashboardData(country)
      setDashboardData(data)
      setDataLoading(false)
    }

    if (!dataLoading) setDataLoading(true)
    fetch().then()
  }, [dashboard.getCountry()])
  if (countriesLoading) {
    return <div>Загрузка....</div>
  }
  const countriesArray = countries.map((country, index) => {
    return {
      label: country.customer_country,
      id: index
    }
  })
  return (
    <div className={style.dashboardContainer}>
      <Autocomplete labels={countriesArray} onChangeValue={(country) => dashboard.setCountry(country.label)} />
      {dataLoading ? (
        <div>Загрузка....</div>
      ) : (
        <>
          <ManyCards cardsData={companiesToCards(dashboardData.companies)} />
        </>
      )}
    </div>
  )
}

export default CustomerDashboard
