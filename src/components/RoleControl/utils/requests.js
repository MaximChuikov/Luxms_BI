const requests = {
  baseUrl: '',
  hiddenDatasets:'33, 133, 44, 45, 46',
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl
  },
  fetchRules () {
    return fetch(`${this.baseUrl}rolecontrol/api/rules`)
      .then(response => response.json())
  },
  fetchFilteredRules (filters, sort, fullTextSearch, page) {
    console.log('filters => ',filters)
    console.log('sorted => ',sort)
    console.log('fullTextSearch => ', fullTextSearch)
    console.log('page => ',page)
    const pageSize = 5
    const url = `${this.baseUrl}rolecontrol/api/rules?${fullTextSearch ? `fullTextSearch=${fullTextSearch}&` : ''}pageNumber=${page}&pageSize=${pageSize}&sort=${encodeURIComponent(JSON.stringify(sort))}&filters=${encodeURIComponent(JSON.stringify(filters))}&hiddenDatasets=${this.hiddenDatasets}`

    return fetch(url, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  fetchFilters () {
    return fetch(`${this.baseUrl}rolecontrol/api/rules/filters`, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  fetchTopics () {
    return fetch(`${this.baseUrl}rolecontrol/api/topics`, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  fetchGroups () {
    return fetch(`${this.baseUrl}rolecontrol/api/groups`, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  fetchLocations () {
    return fetch(`${this.baseUrl}rolecontrol/api/locations`, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  fetchDomainToLocations () {
    return fetch(`${this.baseUrl}rolecontrol/api/domainToLocations`, {
      method:'GET',
      credentials:"include"
    })
      .then(response => response.json())
  },
  sendRule (rule) {
    return fetch(`${this.baseUrl}rolecontrol/api/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(rule),
      credentials:"include"
    })
      .then(response => response.json())
  },
  updateRule (rule) {
    return fetch(`${this.baseUrl}rolecontrol/api/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(rule),
      credentials:"include"
    })
      .then(response => response.json())
  },
  removeRule (rule) {
    return fetch(`${this.baseUrl}rolecontrol/api/rules/${rule.id}`, {
      method: 'DELETE',
      credentials:"include"
    })
  }
}

export default requests
