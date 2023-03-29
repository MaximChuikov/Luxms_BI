import React from 'react'
import ColoredDiagramsContainer from '../ColoredDiagrams/ColoredDiagramsContainer'
import ColoredTable from '../ColoredDiagrams/ColoredTable/ColoredTable'
import {
  companiesToCards,
  convertProductsToRoundDiagramData,
  convertProductsToTableData
} from '../../../ds_4/Dashboard/utils/formatter'
import RoundDiagram from '../ColoredDiagrams/RoundDiagram/RoundDiagram'
import ManyCards from '../ManyCards/ManyCards'
import { IAllCustomerData } from '../../../ds_4/Dashboard/controllers/customer-controller'

export interface ITableRoundCardsDiagramsProps {
  dashboardData: IAllCustomerData
}
const TableRoundCardsDiagrams = ({ dashboardData }: ITableRoundCardsDiagramsProps) => {
  return (
    <div>
      {dashboardData?.products?.length === 0 ?? true ? (
        <div>Данные отсутсвуют</div>
      ) : (
        <>
          <h4>Статистика по товарам</h4>
          <ColoredDiagramsContainer
            TableComponent={<ColoredTable {...convertProductsToTableData(dashboardData.products)} />}
            PieComponent={<RoundDiagram {...convertProductsToRoundDiagramData(dashboardData.products)} />}
          />
          <h4>Лучшие компании страны</h4>
          <ManyCards cardsData={companiesToCards(dashboardData.companies)} />
        </>
      )}
    </div>
  )
}

export default TableRoundCardsDiagrams
