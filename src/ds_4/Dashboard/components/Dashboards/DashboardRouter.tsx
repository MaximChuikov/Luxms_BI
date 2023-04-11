import React, { useContext } from 'react'
import { DashboardContext, Tabs } from '../DashboardProvider'
import CustomerDashboard from './CustomerDashboard'
import SellerDashboard from './SellerDashboard'
import EmployeeDetails from './EmployeeDashboard'

const DashboardRouter = () => {
  const dashboardContext = useContext(DashboardContext)
  function getSelectedDashboard() {
    switch (dashboardContext.getTab()) {
      case Tabs.customers:
        return <CustomerDashboard />
      case Tabs.sellers:
        return <SellerDashboard />
      case Tabs.employeeDetails:
        return <EmployeeDetails />
      default:
        return <div />
    }
  }
  return <div>{getSelectedDashboard()}</div>
}

export default DashboardRouter
