import React, {useState, useEffect, useRef, useContext} from 'react'
import './editRule.css'
import requests from "../../utils/requests";
import Context from "../../Context";
import { useModal }  from '../Modal/ModalContext'
import { useAlert } from '../Alert/AlertProvider'
import SearchSelect from "../SearchSelect";

function EditRule({ data }) {
  const [listGroups, setListGroup] = useState([])
  const [listTopics, setLisTopics] = useState([])
  const [listLocations, setListLocation] = useState([])
  const [listDomains, setListDomains] = useState([])
  const [domainToLocations, setDomainToLocations] = useState({})

  const [domain, setDomain] = useState({ domainId: 0, domainName: null })
  const [group, setGroup] = useState({ name: null })
  const [topic, setTopic] = useState('all')
  const [dataset, setDataset] = useState('all')
  const [dashboard, setDashboard] = useState('all')
  const [dashlet, setDashlet] = useState('all')
  const [location, setLocation] = useState(['all'])
  const firstUpdate = useRef(true) // Флаг для обновления первой записи и создания все следующих при выборе значения "Все" для Дэшборда или Дэшдета

  const { setNewRulesHandler, fetchFilteredRules } = useContext(Context)

  const modal = useModal()
  const alert = useAlert()

  useEffect(() => {
  requests.fetchGroups()
    .then(response => {
      setListGroup(response)
    })

  requests.fetchTopics()
    .then(response => {
      setLisTopics(response.filter(topic => topic.title !== 'Служебные датасеты'))
    })

  requests.fetchLocations()
    .then(response => {
      setListLocation(response.filter(l => l.id !== 1220))
    })

  requests.fetchDomainToLocations()
    .then(response => {
      let domainToLocations = {}
      response.forEach(item => {
        if (item.locationId in domainToLocations) {
          domainToLocations[item.locationId].domains.push(item.domainName)
        } else {
          domainToLocations[item.locationId] = {
            locationName: item.locationName,
            domains: [
              item.domainName
            ]
          }
        }

      })
      setListDomains(response.map((item) => {return {domainName: item.domainName, domainId: item.domainId}}))
      setDomainToLocations(domainToLocations)
      })
  }, [])

  useEffect(() => {
    if (data
    && Object.keys(data).length
    && listGroups.length
    && listTopics.length
    && listLocations.length) {
      const tmpGroups = listGroups.find(group => group.name === data.groupName)
      if (tmpGroups) setGroup(tmpGroups)
      const tmpTopic = listTopics.find(topic => topic.title === data.topicTitle)
      if (tmpTopic) setTopic(tmpTopic)
      const tmpDataset = tmpTopic.datasets && tmpTopic.datasets.find(dataset => dataset.title === data.datasetTitle)
      if (tmpDataset) setDataset(tmpDataset)
      const tmpDashboard = tmpDataset.dashBoards && tmpDataset.dashBoards.find(dashboard => dashboard.title === data.dashboardTitle)
      if (tmpDashboard) setDashboard(tmpDashboard)
      tmpDashboard.dashlets = []
      const tmpDashlet = tmpDashboard.dashlets && tmpDashboard.dashlets.find(dashlet => dashlet.title === data.dashletTitle)
      if (tmpDashlet) setDashlet(tmpDashlet)
      const tmpLocation = listLocations.find(location => location.title === data.locationTitle)
      if (tmpLocation) setLocation([tmpLocation])
    }
  }, [data, listGroups, listTopics, listLocations])

  function sendRequest (rule, resolve, reject) {
    if (data && firstUpdate.current) {
      firstUpdate.current = false
      rule.id = data.id
      requests.updateRule(rule)
        .then(response => {
          if (response.id) {
            setNewRulesHandler(response)
            alert.show('Запись успешно создана', 'success')
          }
          resolve()
        })
        .catch(exception => {
          alert.show('Сохранение не удалось', 'fail')
          reject()
        })
    } else {
      requests.sendRule(rule)
        .then(response => {
          if (response.id) {
            setNewRulesHandler(response)
            alert.show('Запись успешно создана', 'success')
          }
          resolve()
        })
        .catch(exception => {
          alert.show('Сохранение не удалось', 'fail')
          reject()
        })
    }
  }

  function save() {
    const requestCollection = []
    // если не заполнены обязательные поля, выходим и показываем сообщение
    if (topic === 'all') {
      alert.show('Не заполнены обязательные поля', 'warn')
      return null
    }
    let _locations = []
    if (location.length === 1 && location[0] === 'all') {
      _locations = [{id: 1220, title: 'all'}]
    } else {
      _locations = location
    }
    _locations.forEach(loc => {
      if (dataset === 'all' && dashboard === 'all') {
        topic.datasets.forEach((_dataset) => {
          _dataset.dashBoards.forEach((_dashBoard) => {
            const rule = {
              topicId: topic.id,
              datasetId: _dataset.id,
              dashboardId: _dashBoard.id,
              locationId: loc.id,
              groupName: group.name,
              domainName: domain.domainName
            }
            requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
          })
        })
      }
      else if (dataset !== 'all' && dashboard === 'all') {
        dataset.dashBoards.forEach((_dashBoard) => {
          const rule = {
            topicId: topic.id,
            datasetId: dataset.id,
            dashboardId: _dashBoard.id,
            locationId: loc.id,
            groupName: group.name,
            domainName: domain.domainName
          }
          requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
        })
      }
      else if (dataset !== 'all' && dashboard !== 'all') {
        const rule = {
          topicId: topic.id,
          datasetId: dataset.id,
          dashboardId: dashboard.id,
          locationId: loc.id,
          groupName: group.name,
          domainName: domain.domainName
        }
        requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
      }
    })
    /*
    _location.forEach(loc => {
      if (dataset === 'all' && dashboard === 'all') {
        topic.datasets.forEach((_dataset) => {
          _dataset.dashBoards.forEach((_dashBoard) => {
            domainToLocations[loc.id].domains.forEach(domain => {
              const rule = {
                topicId: topic.id,
                datasetId: _dataset.id,
                dashboardId: _dashBoard.id,
                locationId: loc.id,
                groupName: group.name,
                domainName: domain
              }
              requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
            })
          })
        })
      }
      else if (dataset !== 'all' && dashboard === 'all') {
        dataset.dashBoards.forEach((_dashBoard) => {
          domainToLocations[loc.id].domains.forEach(domain => {
            const rule = {
              topicId: topic.id,
              datasetId: dataset.id,
              dashboardId: _dashBoard.id,
              locationId: loc.id,
              groupName: group.name,
              domainName: domain
            }
            requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
          })

        })
      }
      else if (dataset !== 'all' && dashboard !== 'all') {
        domainToLocations[loc.id].domains.forEach(domain => {
          const rule = {
            topicId: topic.id,
            datasetId: dataset.id,
            dashboardId: dashboard.id,
            locationId: loc.id,
            groupName: group.name,
            domainName: domain
          }
          requestCollection.push(new Promise((resolve, reject) => {sendRequest(rule, resolve, reject)}))
        })

      }
    })
    */
    Promise.all(requestCollection)
      .then(() => {
        fetchFilteredRules()
      })
      .catch(() => {
        alert.show('Сохранение не удалось', 'fail')
      })
    modal.hide()
  }

  return (
    <React.Fragment>
      <div className="role-control-modal-header">

      </div>
      <div className="role-control-modal-body">
        <div className="set-selectors">
          <div className="select-item">
            <div className="select-item-label">
              Домен
            </div>
            <SearchSelect
              className="select-item-select"
              value={ domain }
              options={[{ name: 'Все', value: { domainId: 0, domainName: null } }].concat(listDomains.map((item) => {return {name: item.domainName, value: item}}))}
              onChange={(value) => {setDomain(value)}}
            />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Группа в AD
            </div>
              <SearchSelect
                className="select-item-select"
                value={ group }
                options={[{ name: 'Все', value: { name: null } }].concat(listGroups.map((item) => {return {name: item.name, value: item}}))}
                onChange={(value) => {setGroup(value)}}
              />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Направление*
            </div>
            <SearchSelect
              className="select-item-select"
              value={topic}
              options={[{ name: 'Все', value:'all' }].concat(listTopics.map((item) => {return {name: item.title, value: item}}))}
              onChange={(value) => {
                setTopic(value)
                setDataset('all')
                setDashboard('all')
                setDashlet('all')
              }}
            />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Раздел
            </div>
            <SearchSelect
              className="select-item-select"
              value={dataset}
              options={
                [
                  {
                    name: 'Все',
                    value:'all'
                  }
                ]
                .concat(topic.datasets ?
                  topic.datasets.map((item) => {return { name: item.title, value: item }})
                  : [])
              }
              onChange={(value) => {
                setDataset(value)
                setDashboard('all')
                setDashlet('all')
              }}
            />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Форма
            </div>
            <SearchSelect
              className="select-item-select"
              value={dashboard}
              options={
                [{name: 'Все', value:'all'}]
                .concat(dataset.dashBoards ?
                  dataset.dashBoards.map((item) => {return { name: item.title, value: item }})
                  : [])
              }
              onChange={(value) => {
                setDashboard(value)
                setDashlet('all')
              }}
            />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Экран
            </div>
            <SearchSelect
              className="select-item-select"
              value={dashlet}
              options={
                [{name: 'Все', value:'all'}]
                .concat(dashboard.dashlets ?
                  dashboard.dashlets.map((item) => {return { name: item.title, value: item }})
                  : [])
              }
              onChange={(value) => {setDashlet(value)}}
            />
          </div>
          <div className="select-item">
            <div className="select-item-label">
              Дорога
            </div>
            <SearchSelect
              className="select-item-select"
              value={location}
              options={[{ name: 'Все', value:'all' }].concat(listLocations.map((item) => {return { name: item.title, value: item }}))}
              onChange={(value) => {
                setLocation(value)}
              }
              multiselect={ true }
            />
          </div>
        </div>
      </div>
      <div className="role-control-modal-footer">
        <div className="edit-rule-legend">
          * - обязательные поля
        </div>
        <div className="edit-rule-button-set">
          <div>
            <button
              className="edit-rule-button-save"
              onClick={save}
            >
              Сохранить</button>
          </div>
          <div>
            <button
              className="edit-rule-button-close"
              onClick={() => {modal.hide()}}
            >

              Отмена</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default EditRule
