import React, { useState } from 'react'

export enum Tabs {
  sellers,
  customers,
  employeeDetails
}
export interface IDashboardContext {
  changeTab: (tab: Tabs) => void
  getTab: () => Tabs
  getCountry: string | null
  setCountry: (country: string) => void
}
export const DashboardContext = React.createContext<IDashboardContext | null>(null)
export interface IAppProps {
  children: React.ReactNode
}

const DashboardProvider = ({ children }: IAppProps) => {
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
        getCountry: country,
        setCountry(c: string) {
          setCountry(c)
        }
      }}
    >
      <div>{children}</div>
    </DashboardContext.Provider>
  )
}

export default DashboardProvider
