import React from 'react'
import DashboardProvider from './Dashboard/components/DashboardProvider'
import TabsBar from './Dashboard/components/TabsBar/TabsBar'
import DashboardRouter from './Dashboard/components/Dashboards/DashboardRouter'

function App() {
  return (
    <DashboardProvider>
      <div>
        <TabsBar />
        <DashboardRouter />
      </div>
    </DashboardProvider>
  )
}

export default App
