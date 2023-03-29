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

export default function useKoobFetch<T>(
  req: koobRequest,
  callback: (T) => void = () => {},
  koobId = 'luxmsbi.Sales_Demo'
): [T, boolean] {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>({} as T)

  useEffect(() => {
    async function fetch() {
      await koobDataRequest3(koobId, req.dimensions, req.measures, req.allFilters, req.request, req.comment).then(
        (r) => {
          callback(r)
          setData(r)
        }
      )
      setLoading(false)
    }
    fetch().then()
  }, [])
  return [data, loading]
}

export function useFuncFetch<T>(func: () => Promise<T>): [T, boolean] {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>({} as T)

  useEffect(() => {
    async function fetch() {
      setData(await func())
      setLoading(false)
    }
    fetch().then()
  }, [])
  return [data, loading]
}

export async function fetchKoobData<T>(req: koobRequest, koobId = 'luxmsbi.Sales_Demo'): Promise<T> {
  const data = await koobDataRequest3(koobId, req.dimensions, req.measures, req.allFilters, req.request, req.comment)
  return data
}
