import React from 'react'
import ColoredDiagramsContainer from '../../../ds_res/components/ColoredDiagrams/ColoredDiagramsContainer'
import ColoredTable from '../../../ds_res/components/ColoredDiagrams/ColoredTable/ColoredTable'
import RoundDiagram from '../../../ds_res/components/ColoredDiagrams/RoundDiagram/RoundDiagram'
import { IAllEmployeeData } from '../controllers/employee-details-controller'
import Table from '../../../ds_res/components/Table/Table'

export interface IAllEmployeeDiagramsData {
  dashboardData: IAllEmployeeData
}

const EmployeeDiagrams = ({ dashboardData }: IAllEmployeeDiagramsData) => {
  return (
    <div>
      {dashboardData.coloredDiagrams?.table?.diagram.length === 0 ?? true ? (
        <div>Данные отсутсвуют</div>
      ) : (
        <>
          <h4>Статистика по категориям</h4>
          <ColoredDiagramsContainer
            TableComponent={<ColoredTable {...dashboardData.coloredDiagrams.table} />}
            PieComponent={<RoundDiagram {...dashboardData.coloredDiagrams.round} />}
          />
          <h4>Таблица статистики по категориям</h4>
          <Table {...dashboardData.table} />
        </>
      )}
    </div>
  )
}

export default EmployeeDiagrams
