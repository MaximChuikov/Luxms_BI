import React, { useState } from 'react'

export enum Tabs {
  sellers,
  customers,
  employeeDetails
}
export interface IDashboardContext {
  changeTab: (tab: Tabs) => void
  getTab: () => Tabs
}
export const DashboardContext = React.createContext<IDashboardContext | null>(null)

const DashboardProvider = (props: { children: React.ReactNode }) => {
  const [tab, setTab] = useState(Tabs.sellers)
  return (
    <DashboardContext.Provider
      value={{
        changeTab(newTab: Tabs): void {
          setTab(newTab)
        },
        getTab() {
          return tab
        }
      }}
    >
      <div>{props.children}</div>
    </DashboardContext.Provider>
  )
}

export default DashboardProvider
