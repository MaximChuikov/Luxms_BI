import React, { useState } from 'react'

export enum Tabs {
  sellers,
  customers,
  employeeDetails
}
export interface IDashboardContext {
  changeTab: (tab: Tabs) => void
  getTab: () => Tabs
  getCountry: () => string | null
  setCountry: (country: string) => void
}
export const DashboardContext = React.createContext<IDashboardContext | null>(null)

const DashboardProvider = (props: { children: React.ReactNode }) => {
  const [tab, setTab] = useState(Tabs.sellers)
  const [country, setCountry] = useState(null)
  return (
    <DashboardContext.Provider
      value={{
        changeTab(newTab: Tabs): void {
          setTab(newTab)
        },
        getTab() {
          return tab
        },
        getCountry(): null | string {
          return country
        },
        setCountry(c: string) {
          setCountry(c)
        }
      }}
    >
      <div>{props.children}</div>
    </DashboardContext.Provider>
  )
}

export default DashboardProvider
