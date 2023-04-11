import React, { useEffect, useState } from 'react'
import Autocomplete, { IAutocompleteText } from '../../../../ds_res/components/Autocomplete/Autocomplete'
import { toAutocomplete } from '../../../../ds_res/utils/formate'
import SmallLoading from '../../../../ds_res/components/Loading/SmallLoading'
import ManyCardsLoading from '../../../../ds_res/components/Loading/ManyCardsLoading'
import { getAllEmployeeData, getLastnamesList, IAllEmployeeData } from '../../controllers/employee-details-controller'
import EmployeeDiagrams from '../../Diagrams/EmployeeDiagrams'
import style from './dashboard.module.scss'

const SellerStatsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({} as IAllEmployeeData)
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedLastname, setSelectedLastname] = useState(null as IAutocompleteText)
  const [categories, categoriesLoading] = getLastnamesList((data) =>
    setSelectedLastname(toAutocomplete(data, (el) => el.emp_last_name)[0])
  )

  useEffect(() => {
    if (selectedLastname === null) return
    setDataLoading(true)
    getAllEmployeeData(selectedLastname.label).then((res) => {
      setDashboardData(res)
      setDataLoading(false)
    })
  }, [selectedLastname])

  if (categoriesLoading) {
    return <SmallLoading />
  }

  const categoryChangeHandler = (category) => setSelectedLastname(category)

  return (
    <div className={style.dashboardContainer}>
      <Autocomplete
        selectedLabel={'Фамилия'}
        labels={categories}
        onChangeValue={categoryChangeHandler}
        selectedValue={selectedLastname}
      />
      {dataLoading ? <ManyCardsLoading /> : <EmployeeDiagrams dashboardData={dashboardData} />}
    </div>
  )
}

export default SellerStatsDashboard
