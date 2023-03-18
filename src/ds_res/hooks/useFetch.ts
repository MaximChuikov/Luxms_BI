import { useEffect, useState } from 'react'
import { KoobDataService } from 'bi-internal/services'
import { IKoobDataRequest3 } from 'bi-internal/services/koob'

const { koobDataRequest3 } = KoobDataService

export interface koobRequest {
  dimensions: string[]
  measures: string[]
  allFilters: any
  request?: IKoobDataRequest3
  comment?: string
}

export default function useFetch<T>(req: koobRequest, koobId = 'luxmsbi.Sales_Demo'): [T, boolean] {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>({} as T)

  useEffect(() => {
    async function fetch() {
      await koobDataRequest3(koobId, req.dimensions, req.measures, req.allFilters, req.request, req.comment).then((r) =>
        setData(r)
      )
      setLoading(false)
    }
    fetch().then()
  }, [])
  return [data, loading]
}
