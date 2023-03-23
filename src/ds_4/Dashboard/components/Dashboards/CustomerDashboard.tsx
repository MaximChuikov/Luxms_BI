import React, { useContext, useEffect, useState } from 'react'
import Autocomplete from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { getAllDashboardData, getCountries, IAllCustomerData } from '../../controllers/customer-controller'
import { DashboardContext } from '../DashboardProvider'
import ManyCards from '../../../../ds_res/components/ManyCards/ManyCards'
import { companiesToCards, countriesArrToAutocomplete, productsToRoundDiagramData } from '../../utils/formatter'
import RoundDiagram from '../../../../ds_res/components/RoundDiagram/RoundDiagram'
import style from './dashboard.module.scss'

const CustomerDashboard = () => {
  const dashboard = useContext(DashboardContext)
  const [countries, countriesLoading] = getCountries()
  const [dashboardData, setDashboardData] = useState({} as IAllCustomerData)
  const [dataLoading, setDataLoading] = useState(true)

  // Load data when county has changed
  useEffect(() => {
    async function fetch() {
      const country = dashboard.getCountry
      const data = await getAllDashboardData(country)
      setDashboardData(data)
      setDataLoading(false)
    }
    if (dashboard.getCountry !== null) {
      if (!dataLoading) setDataLoading(true)
      fetch().then()
    }
  }, [countries, dashboard.getCountry])

  if (countriesLoading) {
    return <div>Загрузка стран....</div>
  }

  const countriesArray = countriesArrToAutocomplete(countries)

  const Loading = () => <div>Загрузка...</div>
  const Diagrams = () =>
    dashboardData?.products?.length === 0 ?? true ? (
      <div>Данные отсутсвуют</div>
    ) : (
      <>
        <h4>Статистика по товарам</h4>
        <RoundDiagram {...productsToRoundDiagramData(dashboardData.products)} />
        <h4>Лучшие компании страны</h4>
        <ManyCards cardsData={companiesToCards(dashboardData.companies)} />
      </>
    )
  return (
    <div className={style.dashboardContainer}>
      <Autocomplete labels={countriesArray} onChangeValue={(country) => dashboard.setCountry(country.label)} />
      {dataLoading ? Loading() : Diagrams()}
    </div>
  )
}

export default CustomerDashboard
