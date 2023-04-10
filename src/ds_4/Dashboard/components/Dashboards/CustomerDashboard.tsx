import React, { useEffect, useState } from 'react'
import Autocomplete, { IAutocompleteText } from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { getAllDashboardData, getCountries, IAllCustomerData } from '../../controllers/customer-controller'
import { toAutocomplete } from '../../../../ds_res/utils/formate'
import ManyCardsLoading from '../../../../ds_res/components/Loading/ManyCardsLoading'
import SmallLoading from '../../../../ds_res/components/Loading/SmallLoading'
import CustomerDiagrams from '../../Diagrams/CustomerDiagrams'
import style from './dashboard.module.scss'

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({} as IAllCustomerData)
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedCountry, setSelectedCounty] = useState(null as IAutocompleteText)
  const [countries, countriesLoading] = getCountries((data) =>
    setSelectedCounty(toAutocomplete(data, (el) => el.customer_country)[0])
  )

  // Load data when county has changed
  useEffect(() => {
    if (selectedCountry === null) return
    setDataLoading(true)
    getAllDashboardData(selectedCountry.label).then((res) => {
      setDashboardData(res)
      setDataLoading(false)
    })
  }, [selectedCountry])

  if (countriesLoading) {
    return <SmallLoading />
  }

  const countryChangeHandler = (country) => setSelectedCounty(country)

  return (
    <div className={style.dashboardContainer}>
      <Autocomplete labels={countries} onChangeValue={countryChangeHandler} selectedValue={selectedCountry} />
      {dataLoading ? <ManyCardsLoading /> : CustomerDiagrams({ dashboardData })}
    </div>
  )
}

export default CustomerDashboard
