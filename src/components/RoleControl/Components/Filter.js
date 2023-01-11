import React, { useState, useEffect } from 'react'
import '../styles/filter.css'
import BaseCheckbox from './Base-component/BaseCheckbox'
import { CLOSE, FILTERS, FIND, SORT_AZ, SORT_ZA } from '../icon/icons'

function Filter({position, filters, selectedFilters, sorting, name, onSetFilterAndSorting, textTransform }) {
    const [opened, setOpened] = useState(false)
    const [selectAll, setSelectAll] = useState(true)
    const [inSelectedFilters, setSelectedFilters] = useState([])
    const [sortDirection, setSortDirection] = useState(sorting)
    const [filter2Filters, setFilter2Filters] = useState('')
    const [bodyLeftPosition, setBodyLeftPosition] = useState(10)


    const closeFilter = () => {
        setOpened(false)
        clearState()
    }
    const sortFunction = (a, b) => {
      if (a===null) {
        console.log('PING')
      }
        if (selectedFilters.indexOf(a) + 1 && selectedFilters.indexOf(b) + 1) {
            if (a > b || a !== null) {
                return 1
            } else {
                return -1
            }
        }
        if (selectedFilters.indexOf(a) + 1 && !selectedFilters.indexOf(b) + 1) {
            return -1
        }
        if (!selectedFilters.indexOf(a) + 1 && selectedFilters.indexOf(b) + 1) {
            return 1
        }
        if (!selectedFilters.indexOf(a) + 1 && !selectedFilters.indexOf(b) + 1) {
            if (a > b || a !== null) {
                return 1
            } else {
                return -1
            }
        }
    }

    useEffect(() => {
            window.addEventListener('click', closeFilter)
        return () => {
            window.removeEventListener('click', closeFilter)
        }
    })

    useEffect(() => {
        if (!selectedFilters || selectedFilters.length === 0) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }, [selectedFilters])

    useEffect(() => {
        if (!inSelectedFilters || inSelectedFilters.length === 0) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }, [inSelectedFilters])

    useEffect(() => {
        // setSortDirection({...sorting})
        clearState()
        // eslint-disable-next-line
    }, [sorting, selectedFilters])

    const clearState = () =>{
        if (!selectedFilters || selectedFilters.length === 0) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
        setSortDirection({...sorting})
        setFilter2Filters('')
        if (selectedFilters) setSelectedFilters([...selectedFilters])
    }

    const selectAllHandler = () => {
        setSelectedFilters([])
        setSelectAll(!selectAll)
    }

    const selectFilterHandler = (filter) => {
        const isExist = inSelectedFilters.findIndex(f => f === filter) + 1
        setSelectedFilters(prevState => {
            if (!isExist) {
                return [...prevState, filter]
            } else {
                return prevState.filter(f => f !== filter)
            }

        })
    }

    const setSortDirectionHandler = (direction) => {
        setSortDirection(prev => {
            return {
                ...prev,
                name,
                direction
            }
        })
    }
    function openFilterBody(e) {
        const leftPosition = e.clientX - 15 * Number(document.getElementsByTagName('HTML')[0].style['font-size'].replace('px', ''))
        e.stopPropagation()
        setOpened(!opened)
        if (leftPosition > 10) setBodyLeftPosition(leftPosition)
    }

    return (
        <div
          className="filters-wrapper"
          onClick={ (e) => { e.stopPropagation() }}>
            <div className={`filters-svg-wrapper ${(selectedFilters && selectedFilters.length > 0) || sorting.name === name ? 'filtered' : ''}`}
                 onClick={(e) => { openFilterBody(e) }}
            >
              {FILTERS('filters-svg') || null}
            </div>
            <div
                style={{
                    display: !opened ? 'none' : 'block',
                    left: bodyLeftPosition
                }}
                className={`filters-body ${position && position === 'right' ? 'filters__right' : 'filters__left' }`}
            >
                {CLOSE('close-modal-button', null, closeFilter) || null}
                <div className="filters">
                    <div
                      className={`sorting-a-z ${sortDirection.name === name && sortDirection.direction === 'asc' ? 'current-sorting' : ''}`}
                      onClick={() => {setSortDirectionHandler('asc')}}
                    >
                        <div className="sorting-a-z-icon">
                          {SORT_AZ('sorting-a-z-icon-svg') || null}
                        </div>
                    <div
                        className="sorting-a-z-title"
                    >Сортировка по возрастанию
                    </div>
                </div>
                <div
                    className={`sorting-z-a ${sortDirection.name === name && sortDirection.direction === 'desc' ? 'current-sorting' : ''}`}
                    onClick={() => {setSortDirectionHandler('desc')}}
                >
                    <div className="sorting-z-a-icon">
                      {SORT_ZA('sorting-z-a-icon-svg') || null}
                    </div>
                    <div className="sorting-z-a-title">Сортировка по убыванию</div>
                </div>
                <hr className="filter-hr" />
                <div className="search-input">
                    <input
                      className="search-input-input"
                      type="text"
                      value={filter2Filters}
                      onChange={(event) => {setFilter2Filters(event.target.value)}}
                    />
                    <div className="search-input-button">
                      {FIND('search-input-button-svg') || null}
                    </div>
                </div>
                <ul className="filters-items">
                    <li
                      className="filters-item show-all"
                      onClick={() => {
                          selectAllHandler()
                      }}
                    >
                        <div className={'filters-checkbox'}>
                            <BaseCheckbox
                                checked={selectAll}
                                onChange={() => {selectAllHandler()}}
                            />
                        </div>
                        <div className="show-all-title">Показать все</div>
                    </li>
                    {
                      filters.filter(f => !filter2Filters || (f && filter2Filters && f.toLowerCase().indexOf(filter2Filters.toLowerCase()) + 1)).sort(sortFunction).map( (filter, id) => {
                        return (
                          <li
                            className="filters-item"
                            key={id}
                            onClick={() => {
                                selectFilterHandler(filter)
                            }}
                          >
                              <div className={'filters-checkbox'}>
                                  <BaseCheckbox
                                    checked={inSelectedFilters.findIndex(f => f === filter) + 1}
                                    onChange={() => {
                                        selectFilterHandler(filter)}
                                    }
                                  />
                              </div>
                              <div className={`filters-item-title ${textTransform ? 'text-transform' : ''}`}>{filter ? filter : 'Все'}</div>
                          </li>
                        )
                      })
                    }
                </ul>
                <div className="apply-filter">
                    <button
                      className="apply-filter-button"
                      onClick={() => {
                          onSetFilterAndSorting({name, sorting: sortDirection, filters: inSelectedFilters })
                          closeFilter()
                      }}
                    >
                        Посмотреть
                    </button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Filter
