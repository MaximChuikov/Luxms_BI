import React, {useState, useEffect} from 'react'
import '../styles/searchSelect.css'
import { FIND } from '../icon/icons';

function SearchSelect({value, options, onChange, multiselect = false}) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedItems, setSelectedItem] = useState(multiselect ? value : [])
  const [multiselectFilter, setMultiselectFilter] = useState('')

  useEffect(() => {
    setName(findName())
    if (multiselect) setSelectedItem(value)
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    if (multiselect) onChange(selectedItems)
  }, [selectedItems])

  const hide = (event) => {
    setIsOpen(false)
  }
  useEffect(() => {
    window.addEventListener('click', hide)

    return () => {
      window.removeEventListener('click', hide)
    }
  }, [])

  function findName() {
    if (multiselect) {
      // if (value === 'all') return 'Все'
      let name = ''
      console.log('value ', value)
      value.forEach(item => {
        if (typeof(item) === 'object') {
          const option = options.find(option => JSON.stringify(option.value) === JSON.stringify(item))
          name = name === '' ? option.name : `${name},${option.name}`
        } else {
          const option = options.find(option => option.value.toString() === item.toString())
          name = name === '' ? option.name : `${name},${option.name}`
        }
      })
      return name
    } else {
      if (typeof(value) === 'object') {
        const option = options.find(option => JSON.stringify(option.value) === JSON.stringify(value))
        return option ? option.name : ''
      } else {
        const option = options.find(option => option.value.toString() === value.toString())
        return option ? option.name : ''
      }
    }
  }

  function selectItem (option) {
    if (multiselect) {
      if (option.value === 'all') {
        setSelectedItem(['all'])
        setName('Все')
        return
      }
      if (typeof(option.value) === 'object') {
        const isSelected = JSON.stringify(selectedItems).indexOf(JSON.stringify(option.value)) + 1
        if (isSelected) {
          setSelectedItem(prev => {
            return prev.filter( item => JSON.stringify(item) !== JSON.stringify(option.value))
          })
          setName(prev => {
            const prevArr = prev.split(',')
            return prevArr.filter(f => f !== option.name).join(',')
          })
        } else {
          setSelectedItem(prev => {
            return [...prev, option.value].filter(item => item !== 'all')
          })
          setName(prev => {
            return prev === '' ? option.name : `${prev},${option.name}`
          })
        }
      } else {
        const isSelected = selectedItems.indexOf(option.value) + 1
        if (isSelected) {
          setSelectedItem(prev => {
            return prev.filter( item => item !== option.value)
          })
          setName(prev => {
            const prevArr = prev.split(',')
            return prevArr.filter(f => f !== option.name).join(',')
          })
        } else {
          setSelectedItem(prev => {
            return [...prev, option.value].filter(item => item !== 'all')
          })
          setName(prev => {
            return prev === '' ? option.name : `${prev},${option.name}`
          })
        }
      }
    } else {
      onChange(option.value)
      setName(option.name)
    }
  }

  const filterOptions = (option) => {
    if (multiselect) {
      return option.name.toLowerCase().indexOf(multiselectFilter.toLowerCase()) + 1
    } else {
      return name === 'Все' || (option.name.toLowerCase().indexOf(name.toLowerCase()) + 1 || option.name === "Все")
    }

  }

  return (
    <div
      className="search-select"
      id="search-select"
      onClick={(event) => {
        event.stopPropagation()
        if (multiselect) {
          if (!isOpen) setIsOpen(true)
        } else {
          setIsOpen(!isOpen)
        }
      }}
    >
      <input
        className={`search-select-input ${isOpen && 'search-select-input__opened'}`}
        value={name}
        title={name}
        placeholder={findName()}
        onChange={(event) => {
            setIsOpen(true);
            setName(event.target.value)
          }
        }
      />
      <div className="empty-button"></div>
      {
        isOpen && (
          <div className={'options-list-wrapper'}>
            {multiselect && (
              <div className={'search-select-filter'}>
                <input
                  className={`search-select-filter-input`}
                  value={multiselectFilter}
                  onChange={(event) => {
                    setMultiselectFilter(event.target.value)
                    }
                  }
                />
                {FIND('search-select-filter-svg') || null}
              </div>
            )}
            <ul className={multiselect ? 'options-list__multiselect' : 'options-list'}>
              {
                options && options.filter(filterOptions).map((option, index) => {
                // options && options.filter(option => option.value === 'all' || (option.name.toLowerCase().indexOf(name.toLowerCase()) + 1 || option.name === "Все")).map((option, index) => {
                  return (
                    <li
                      className={`option ${JSON.stringify(selectedItems).indexOf(JSON.stringify(option.value)) + 1 ? 'option__selected': ''}`}
                      key={index}
                      onClick={() => {
                        selectItem(option)
                      }}
                    >
                      {option.name}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default SearchSelect
