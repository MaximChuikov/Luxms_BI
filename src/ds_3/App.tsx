import React, { useState } from 'react'
import '../ds_res/styles/Reset.module.scss'
import { UrlState } from 'bi-internal/core'
import cx from 'classnames'
// import { SummaryTotalDashWithTabs } from './src/Main/containers/SummaryTotalDashWithTabs'
// import { IndicatorsTotalDash } from './src/Main/containers/IndicatorsTotalDash'
// import Color from './ds_res/styles/Colors.module.scss'
import styles from './App.module.scss'
// import { PerspectiveDashWithRadarChart } from './src/Main/containers/PerspectiveDashWithRadarChart'
// import { mockData } from './src/Base/components/StackedBarChart/mockData'
import { SummaryPage } from './src/Main/pages/SummaryPage'

const App = () => {
  const urlState = UrlState.getInstance()
  const [theme, toggleTheme] = useState('dark')
  const handleThemeSwitch = () => {
    toggleTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    urlState.updateModel({ theme })
  }
  // useEffect(() => {
  //   // eslint-disable-next-line no-underscore-dangle
  //   ;(window as any).parent.__urlState.subscribeUpdatesAndNotify(() => {
  //     // eslint-disable-next-line no-underscore-dangle
  //     const urlModel = (window as any).parent.__urlState.getModel()
  //     // eslint-disable-next-line no-prototype-builtins
  //     if (urlModel.hasOwnProperty('deviationTypes')) {
  //       setDashState({ ...dashState, deviationTypes: { value: urlModel.deviationTypesOptions } })
  //     }
  //   })
  // }, [])
  return (
    <div className={cx(styles[`theme-${theme}`])}>
      <button type="button" onClick={handleThemeSwitch}>
        Переключить тему
      </button>
      <SummaryPage />
    </div>
  )
}

export default App
