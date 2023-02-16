import React, { useState } from 'react'
import '../ds_res/styles/Reset.module.scss'
import { UrlState } from 'bi-internal/core'
import cx from 'classnames'
import { IndicatorsPage } from './src/Main/pages/indiacatorsPage'
import styles from './App.module.scss'

const App = () => {
  const urlState = UrlState.getInstance()
  const [theme, toggleTheme] = useState('dark')
  const handleThemeSwitch = () => {
    toggleTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    urlState.updateModel({ theme })
  }
  // useEffect(() => {
  //   urlState.updateModel({ theme })
  // }, [theme])
  return (
    <div className={cx(`theme-${theme}`, styles.app)}>
      <button type="button" onClick={handleThemeSwitch}>
        Переключить тему
      </button>
      <IndicatorsPage />
    </div>
  )
}

export default App
