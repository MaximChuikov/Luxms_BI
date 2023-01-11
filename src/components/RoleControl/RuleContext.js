import React, {useContext, useReducer} from 'react'

const RuleContext = React.createContext()

export const useRule = () => {
  return useContext(RuleContext)
}

const FETCH_ROLE = 'fetch'
const ADD_ROLE = 'add'
const REMOVE_ROLE = 'remove'

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_ROLE: return {...state, visible: true}
    case ADD_ROLE: return {...state, visible: false}
    case REMOVE_ROLE: return {...state, visible: false}
    default: return state
  }
}

export const RuleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    rule: {}
  })

  const fetch = (modalContent, modalData) => dispatch({ type: FETCH_ROLE, modalContent, modalData })
  const add = () => dispatch({ type: ADD_ROLE })
  const remove = () => dispatch({ type: REMOVE_ROLE })

  return (
    <RuleContext.Provider value={{
      rule: state.rule,
      fetch, add, remove
    }}>
      { children }
    </RuleContext.Provider>
  )
}
