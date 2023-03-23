import React from 'react'
import style from './tab.module.scss'

export interface ITab {
  name: string
  tabId: number
}

const Tabs = (props: { tabs: ITab[]; onChange: (tab: ITab) => void; selectedTabId: number }) => {
  return (
    <div className={style.tabsContainer}>
      {props.tabs.map((e: ITab) => (
        <div
          key={e.tabId}
          onClick={() => props.onChange(e)}
          className={[style.tab, props.selectedTabId === e.tabId && style.selected].join(' ')}
        >
          {e.name}
        </div>
      ))}
    </div>
  )
}

export default Tabs
