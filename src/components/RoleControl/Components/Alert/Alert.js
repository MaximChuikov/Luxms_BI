import React from 'react'
import './Alert.css'
import { useAlert } from './AlertProvider'
import {ALERT, CLOSE} from "../../icon/icons"

function Alert() {
  const alert = useAlert()

  if (!alert.visible) return null

  return (
    <div
      className={`alert-wrapper alert-wrapper__${alert.alertType}`}>
      <div className="alert-icon">
        {ALERT(alert.alertType, 'alert-icon-svg')}
      </div>
      <div className="alert-message">
        {alert.text}
      </div>
      <div
        className="alert-close-button"
        onClick={alert.hide}
      >
        {CLOSE('alert-close-button-icon')}
      </div>
    </div>
  )
}

export default Alert
