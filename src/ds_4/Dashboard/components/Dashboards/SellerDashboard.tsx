import React, { useEffect, useState } from 'react'
import { getAllSellersData, getCategoriesList, IAllSellerData } from '../../controllers/seller-controller'
import Autocomplete, { IAutocompleteText } from '../../../../ds_res/components/Autocomplete/Autocomplete'
import SmallLoading from '../../../../ds_res/components/Loading/SmallLoading'
import SellerDiagrams from '../../Diagrams/SellerDiagrams'
import ManyCardsLoading from '../../../../ds_res/components/Loading/ManyCardsLoading'
import { toAutocomplete } from '../../../../ds_res/utils/formate'
import style from './dashboard.module.scss'

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({} as IAllSellerData)
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null as IAutocompleteText)
  const [categories, categoriesLoading] = getCategoriesList((data) =>
    setSelectedCategory(toAutocomplete(data, (el) => el.categoryname)[0])
  )

  useEffect(() => {
    if (selectedCategory === null) return
    setDataLoading(true)
    getAllSellersData(selectedCategory.label).then((res) => {
      setDashboardData(res)
      setDataLoading(false)
    })
  }, [selectedCategory])

  if (categoriesLoading) {
    return <SmallLoading />
  }

  const categoryChangeHandler = (category) => setSelectedCategory(category)

  return (
    <div className={style.dashboardContainer}>
      <Autocomplete
        selectedLabel={'Категория'}
        labels={categories}
        onChangeValue={categoryChangeHandler}
        selectedValue={selectedCategory}
      />
      {dataLoading ? <ManyCardsLoading /> : <SellerDiagrams dashboardData={dashboardData} />}
    </div>
  )
}

export default SellerDashboard
