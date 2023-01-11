import React, { useContext, useState } from 'react'
import '../styles/ruleTable.css'
import RuleTableItem from './RuleTableItem'
import Filter from './Filter'
import EditRule from './Modal/EditRule'
import requests from "../utils/requests"
import Context from "../Context"
import { useModal } from './Modal/ModalContext'
import { useAlert } from "./Alert/AlertProvider"
import { CLEAR_FILTERES } from '../icon/icons'

function RuleTable({ rules, newRules, filters, failData }) {
  const [isFiltered, setIsFiltered] = useState(false)
  const { show } = useModal()
  const alert = useAlert()
  const { sorting, setSorting, requestFilters, setRequestFilters, fetchFilteredRules, removeNewRule, clearFilterAndSorting } = useContext(Context)

  function setFilterAndSorting(filtersData) {
    setSorting({...filtersData.sorting})
    setRequestFilters(prev => {
      const tmp = {...prev}
      tmp[filtersData.name] = filtersData.filters
      return tmp
    })
  }

  function editRule(rule) {
    show(EditRule, rule)
  }

  function removeRule(rule) {
    requests.removeRule(rule)
      .then(response => {
        alert.show('Запись успешно удалена', 'success')
        fetchFilteredRules()
        removeNewRule(rule)
      })
      .catch(error => {
        alert.show('Удаление не удалось', 'fail')
      })
  }

  function distinctRuleArray(array) {
    const byUniq = array.reduceRight(function(map, obj) {
      map[obj.id] = obj
      return map;
    }, {})
    var result = []
    for ( var item in byUniq ){
      result.push( byUniq[ item ] )
    }
    return result
  }

    return (
      <div className="filtered-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Домен</div>
                  <div className="column-header-TableFilters">
                    <Filter
                      position="left"
                      filters={filters.domains && filters.domains.length > 0 ? filters.domains : [] }
                      selectedFilters={requestFilters.domainName || []}
                      name="domainName"
                      sorting={sorting}
                      onSetFilterAndSorting={(filtersData) => {
                        setIsFiltered(true)
                        setFilterAndSorting(filtersData)
                      }
                      }
                      textTransform={false}
                    />
                  </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Группа в AD</div>
                    <div className="column-header-TableFilters">
                      <Filter
                        position="right"
                        filters={filters && filters.groupName && filters.groupName.length > 0 ? filters.groupName : [] }
                        selectedFilters={requestFilters.groupName || []}
                        name="groupName"
                        sorting={sorting}
                        onSetFilterAndSorting={(filtersData) => {
                            setIsFiltered(true)
                            setFilterAndSorting(filtersData)
                          }
                        }
                      />
                    </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Направление</div>
                    <div className="column-header-TableFilters">
                      <Filter
                        position="right"
                        filters={filters && filters.topicTitle && filters.topicTitle.length > 0 ? filters.topicTitle : [] }
                        selectedFilters={requestFilters.topicTitle || []}
                        name="topicTitle"
                        sorting={sorting}
                        onSetFilterAndSorting={(filtersData) => {
                            setIsFiltered(true)
                            setFilterAndSorting(filtersData)
                          }
                        }
                        textTransform={true}
                      />
                    </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Раздел</div>
                  <div className="column-header-TableFilters">
                    <Filter
                      position="right"
                      filters={filters && filters.datasetTitle && filters.datasetTitle.length > 0 ? filters.datasetTitle : [] }
                      selectedFilters={requestFilters.datasetTitle || []}
                      name="datasetTitle"
                      sorting={sorting}
                      onSetFilterAndSorting={(filtersData) => {
                          setIsFiltered(true)
                          setFilterAndSorting(filtersData)
                        }
                      }
                      textTransform={true}
                    />
                  </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Форма</div>
                  <div className="column-header-TableFilters">
                    <Filter
                      position="right"
                      filters={filters && filters.dashboardTitle && filters.dashboardTitle.length > 0 ? filters.dashboardTitle : [] }
                      selectedFilters={requestFilters.dashboardTitle || []}
                      name="dashboardTitle"
                      sorting={sorting}
                      onSetFilterAndSorting={(filtersData) => {
                          setIsFiltered(true)
                          setFilterAndSorting(filtersData)
                        }
                      }
                      textTransform={true}
                    />
                  </div>
                  </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Экран</div>
                  <div className="column-header-TableFilters">
                    {/*TODO раскоментировать когда будет доступна возможность раздавать права на Дэшлеты*/}
                    {/*<Filter*/}
                    {/*  position="right"*/}
                    {/*  filters={filters && filters.dashletTitle.length > 0 ? filters.dashletTitle : [] }*/}
                    {/*  selectedFilters={requestFilters.dashletTitle}*/}
                    {/*  name="dashletTitle"*/}
                    {/*  sorting={sorting}*/}
                    {/*  onSetFilterAndSorting={(filtersData) => {setFilterAndSorting(filtersData)}}*/}
                    {/*/>*/}
                  </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div className="column-header-title">Дорога</div>
                  <div className="column-header-TableFilters">
                    <Filter
                      position="left"
                      filters={filters && filters.locationTitle && filters.locationTitle.length > 0 ? filters.locationTitle : [] }
                      selectedFilters={requestFilters.locationTitle || []}
                      name="locationTitle"
                      sorting={sorting}
                      onSetFilterAndSorting={(filtersData) => {
                          setIsFiltered(true)
                          setFilterAndSorting(filtersData)
                        }
                      }
                      textTransform={true}
                    />
                  </div>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <div
                    className="column-header-title"
                    title={'Очистить фильтры и сортировку'}
                  >
                    <div
                        onClick={() => {
                            setIsFiltered(false)
                            clearFilterAndSorting()
                          }
                        }
                    >
                      {CLEAR_FILTERES(`clear-filter-svg ${isFiltered ? 'clear-filter-svg__filtered': '' }`) || null}
                    </div>

                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              distinctRuleArray(newRules).map( (rule, index) => {
                rule.dashletTitle = 'Все'
                return (
                  <RuleTableItem
                    key={index}
                    rule={rule}
                    isNew={true}
                    onEditRule={(rule) => {editRule(rule)}}
                    onRemoveRule={(rule) => {removeRule(rule)}}
                  />
                )
              })
            }
            {
              !failData && rules.map( rule => {
                return (
                  <RuleTableItem
                    key={rule.id}
                    rule={rule}
                    isNew={false}
                    onEditRule={(rule) => {editRule(rule)}}
                    onRemoveRule={(rule) => {removeRule(rule)}}
                  />
                )
              })
            }
            {
              failData &&
              <tr>
                <td
                  colSpan={8}
                >
                  <div className={'fail-data-message'}>
                    Ошибка данных на этой странице!
                  </div>

                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    )
}

export default RuleTable
