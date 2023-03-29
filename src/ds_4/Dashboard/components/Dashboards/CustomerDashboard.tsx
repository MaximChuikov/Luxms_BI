import React, { useEffect, useState } from 'react'
import Autocomplete, { IAutocompleteText } from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { getAllDashboardData, getCountries, IAllCustomerData } from '../../controllers/customer-controller'
import { countriesArrToAutocomplete } from '../../utils/formatter'
import ManyCardsLoading from '../../../../ds_res/components/Loading/ManyCardsLoading'
import SmallLoading from '../../../../ds_res/components/Loading/SmallLoading'
import TableRoundCardsDiagrams from '../../../../ds_res/components/Diagrams/TableRoundCardsDiagrams'
import style from './dashboard.module.scss'

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({} as IAllCustomerData)
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedCountry, setSelectedCounty] = useState(null as IAutocompleteText)
  const [countries, countriesLoading] = getCountries((data) => setSelectedCounty(countriesArrToAutocomplete(data)[0]))

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
      {dataLoading ? <ManyCardsLoading /> : TableRoundCardsDiagrams({ dashboardData })}
    </div>
  )
}

export default CustomerDashboard
