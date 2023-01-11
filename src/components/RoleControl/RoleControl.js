import React, {Fragment, useState, useRef, useEffect} from 'react'
import './styles/roleControlMain.css'
import RuleTable from './Components/RuleTable'
import Loader from './Components/Loader'
import Modal from './Components/Modal/Modal'
import Header from './Components/Header'
import Context from "./Context";
import { ModalProvider } from './Components/Modal/ModalContext'
import {AlertProvider, useAlert} from './Components/Alert/AlertProvider'
import requests from "./utils/requests"
import Paginator from "./Components/Paginator"
import Alert from "./Components/Alert/Alert"


function RoleControl(props) {

  const [rules, setRules] = useState([])
  const [newRules, setNewRules] = useState([])
  const [loading, setLoading] = useState(true)
  const page = useRef(0)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState({
    name: 'id',
    direction: 'desc'
  })
  const [requestFilters, setRequestFilters] = useState({})
  const [fullTextSearch, setFullTextSearch] = useState('')
  const [filters, setFilters] = useState({
    dashboardTitle: [],
    datasetTitle: [],
    groupName: [],
    locationTitle: [],
    topicTitle: [],
    domainName:[]
  })
  const [failPage, setFailPage] = useState(false)

  const clearFilterAndSorting = () => {
    setRequestFilters({})
    setSorting({
      name: 'id',
      direction: 'desc'
    })
  }


  useEffect(() => {
    requests.setBaseUrl(props.baseUrl)
    const hiddenTopics = ['Служебные датасеты']
    const hiddenDatasets = ['Для разработчиков']
    const hiddenDashboards = ['Ресурсы']
    requests.fetchFilters()
      .then(filters => {
        const filteredFilters = {...filters}
        for (const filter in filters) {
          if (filter === 'topicTitle'){
            filteredFilters[filter] = filters[filter].filter(f => !(hiddenTopics.indexOf(f) + 1) )
          }
          if (filter === 'datasetTitle'){
            filteredFilters[filter] = filters[filter].filter(f => !(hiddenDatasets.indexOf(f) + 1) )
          }
          if (filter === 'dashboardTitle'){
            filteredFilters[filter] = filters[filter].filter(f => !(hiddenDashboards.indexOf(f) + 1) )
          }
        }
        setFilters(filteredFilters)
      })
  }, [props])

  // при изменении фильтров или сортировки текущей страницей делаем первую
  useEffect(() => {
    page.current = 0
    fetchFilteredRules()
    // eslint-disable-next-line
  }, [requestFilters, sorting, fullTextSearch])

  function fetchFilteredRules () {
    // setLoading(true)
    requests.fetchFilteredRules(requestFilters, sorting, fullTextSearch, page.current)
      .then( response => {
        // TODO это заглушка для отображения Дашлетов, убрать её нужно будет когда в
        // LuxMs BI появится возможность устанавливать права на Дашлеты
        let modRules = []
        if (response.rows) {
          if (failPage) {
            setFailPage(false)
          }
          modRules = response.rows.map((rule) => {
            rule.dashletTitle = 'Все'
            return rule
          })
          setRules(modRules)
          page.current = response.pageNumber
          setPageCount(response.pageCount + 1 )
          setLoading(false)
        } else {
          setFailPage(true)
          page.current = page.current ++
          setLoading(false)
        }
      })
  }

  function setPage(newPage) {
    page.current = newPage - 1
    fetchFilteredRules()
  }

  function setNewRulesHandler(rule) {
    setNewRules(prev => {
      return [rule, ...prev]
    })
  }

  function removeNewRule (rule) {
    setNewRules(prev => {
      return prev.filter(f => f.id !== rule.id)
    })
  }

    return (
      <Fragment>
        <ModalProvider>
          <AlertProvider>
            <Context.Provider value={{
              sorting,
              setSorting,
              requestFilters,
              setRequestFilters,
              fullTextSearch,
              setFullTextSearch,
              clearFilterAndSorting,
              setNewRulesHandler,
              fetchFilteredRules,
              removeNewRule

            }}
            >
              <Modal />
              <Alert />
              <div className="rule-control-wrapper">
                <div className={`header-body-wrapper`}>
                  <Header />
                  {loading ?  <Loader />
                  : <RuleTable
                      rules={rules}
                      newRules={newRules}
                      filters={filters}
                      failData={failPage}
                    />
                  }
                </div>
                <Paginator
                  pageCount={pageCount - 1}
                  currentPage={page.current + 1}
                  onSetPage={(page) => {setPage(page)}}
                />
              </div>
            </Context.Provider>
          </AlertProvider>
        </ModalProvider>
      </Fragment>
    )
}
export default RoleControl
