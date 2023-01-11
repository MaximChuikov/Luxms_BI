import React, { useContext, useReducer, useRef } from 'react'

const AlertContext = React.createContext()

export const useAlert = () => {
  return useContext(AlertContext)
}

const SHOW_ALERT = 'show'
const HIDE_ALERT = 'hide'
const SUCCESS = 'success'

const reducer = (state, action) => {
  switch (action.type) {
    case SHOW_ALERT: return {...state, visible: true, text: action.text, alertType: action.alertType}
    case HIDE_ALERT: return {...state, visible: false}
    default: return state
  }
}

export const AlertProvider = ({ children }) => {
  const timer = useRef(0)
  const [state, dispatch] = useReducer(reducer, {
    visible: false,
    alertType: SUCCESS,
    text: ''
  })

  const show = (text, alertType) => {
    dispatch({ type: SHOW_ALERT, text, alertType })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      dispatch({ type: HIDE_ALERT })
    }, 15000)
  }
  const hide = () => dispatch({ type: HIDE_ALERT })

  return (
    <AlertContext.Provider value={{
      visible: state.visible,
      text: state.text,
      alertType: state.alertType,
      show, hide
    }}>
      { children }
    </AlertContext.Provider>
  )
}
