import React, { useRef, useState, useContext } from 'react'
import EditRule from './Modal/EditRule'
import {useModal} from './Modal/ModalContext'
import '../styles/header.css'
import Context from "../Context"
import { FIND } from '../icon/icons'

function Header() {
  const modal = useModal()
  const { setFullTextSearch } = useContext(Context)
  const [innerFullTextSearch, setInnerFullTextSearch] = useState('')
  const fullTextSearchTimer = useRef(0)

  function changeFullTextSearch (text) {
    if (fullTextSearchTimer.current) clearInterval(fullTextSearchTimer.current)
    if (text.length >= 3 || !text) {
      // ставлю таймер на случай последующего ввода символа, чтоб не делать лишних запросов
      fullTextSearchTimer.current = setTimeout(() => {
        setFullTextSearch(text)
      }, 2000)
    }
    setInnerFullTextSearch(text)
  }

  return (
    <header className="rule-control-header">
      <button
        className="create-item-button"
        onClick={() => modal.show(EditRule, null)}
      >
        Создать запись
      </button>
      <div className="header-search-input">

        <input
          className="header-search-input-input"
          type="text"
          value={innerFullTextSearch}
          onChange={(event) => {changeFullTextSearch(event.target.value)}}
        />
        <div className="header-search-input-button">
          {FIND('header-search-input-button-svg') || null}
        </div>
      </div>
    </header>
  )
}

export default Header
