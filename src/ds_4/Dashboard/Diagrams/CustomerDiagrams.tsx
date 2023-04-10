import React from 'react'
import ColoredDiagramsContainer from '../../../ds_res/components/ColoredDiagrams/ColoredDiagramsContainer'
import ColoredTable from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
import { companiesToCards } from '../utils/CustomerFormatter'
import RoundDiagram from '../../../ds_res/components/ColoredDiagrams/RoundDiagram/RoundDiagram'
import ManyCards from '../../../ds_res/components/ManyCards/ManyCards'
import { IAllCustomerData } from '../controllers/customer-controller'

export interface ITableRoundCardsDiagramsProps {
  dashboardData: IAllCustomerData
}
const CustomerDiagrams = ({ dashboardData }: ITableRoundCardsDiagramsProps) => {
  return (
    <div>
      {dashboardData?.productsTable?.diagram.length === 0 ?? true ? (
        <div>Данные отсутсвуют</div>
      ) : (
        <>
          <h4>Статистика по товарам</h4>
          <ColoredDiagramsContainer
            TableComponent={<ColoredTable {...dashboardData.productsTable} />}
            PieComponent={<RoundDiagram {...dashboardData.productsRound} />}
          />
          <h4>Лучшие компании страны</h4>
          <ManyCards cardsData={companiesToCards(dashboardData.companies)} />
        </>
      )}
    </div>
  )
}

export default CustomerDiagrams
