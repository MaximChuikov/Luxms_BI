import React, {useContext, useReducer} from 'react'

const ModalContext = React.createContext()

export const useModal = () => {
  return useContext(ModalContext)
}

const SHOW_MODAL = 'show'
const HIDE_MODAL = 'hide'

const reducer = (state, action) => {
  switch (action.type) {
    case SHOW_MODAL: return {...state, visible: true, modalContent: action.modalContent, modalData: action.modalData}
    case HIDE_MODAL: return {...state, visible: false}
    default: return state
  }
}

export const ModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    visible: false,
    modalContent: {},
    modalData: {}
  })

  const show = (modalContent, modalData) => dispatch({ type: SHOW_MODAL, modalContent, modalData })
  const hide = () => dispatch({ type: HIDE_MODAL })

  return (
    <ModalContext.Provider value={{
      visible: state.visible,
      modalContent: state.modalContent,
      modalData: state.modalData,
      show, hide
    }}>
      { children }
    </ModalContext.Provider>
  )
}
