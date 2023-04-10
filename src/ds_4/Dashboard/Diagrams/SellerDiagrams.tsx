import React from 'react'
import ColoredTable from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
import { IAllSellerData } from '../controllers/seller-controller'
import Cards from '../../../ds_res/components/BigCards/Cards'
import Table from '../../../ds_res/components/Table/Table'

export interface ITableRoundCardsDiagramsProps {
  dashboardData: IAllSellerData
}
const SellersDiagrams = ({ dashboardData }: ITableRoundCardsDiagramsProps) => {
  return (
    <div>
      <h4>Статистика по категории</h4>
      <Cards cardsData={dashboardData.categoryStats.cardsData} />
      <h4>Лучшие продавцы по объёму продаж</h4>
      <ColoredTable {...dashboardData.bestSellers} />
      <h4>Статистика компаний</h4>
      <Table {...dashboardData.sellersStats} />
    </div>
  )
}

export default SellersDiagrams
