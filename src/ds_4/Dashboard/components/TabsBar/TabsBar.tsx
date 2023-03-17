import React, { useContext } from 'react'
import { DashboardContext, Tabs as TabsEnum } from '../DashboardProvider'
import Tabs, { ITab } from '../../../../ds_res/components/Tabs/Tabs'

const tabsNames: ITab[] = [
  {
    name: 'Продавцы',
    tabId: TabsEnum.sellers
  },
  {
    name: 'Покупатели',
    tabId: TabsEnum.customers
  },
  {
    name: 'Детализация продаж по сотрудникам',
    tabId: TabsEnum.employeeDetails
  }
]

const TabsBar = () => {
  const dashboard = useContext(DashboardContext)
  function clickHandler(tabClicked: ITab) {
    dashboard.changeTab(tabClicked.tabId)
  }
  return <Tabs tabs={tabsNames} onChange={clickHandler} selectedTabId={dashboard.getTab} />
}

export default TabsBar
