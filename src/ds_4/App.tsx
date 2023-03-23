import React from 'react'
import DashboardProvider from './Dashboard/components/DashboardProvider'
import TabsBar from './Dashboard/components/TabsBar/TabsBar'
import DashboardRouter from './Dashboard/components/Dashboards/DashboardRouter'
import style from './app.module.scss'

function App() {
  return (
    <span>
      <div className={style.app}>
        <DashboardProvider>
          <TabsBar />
          <DashboardRouter />
        </DashboardProvider>
      </div>
    </span>
  )
}

export default App
