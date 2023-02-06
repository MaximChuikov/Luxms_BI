import React, { ReactElement } from 'react'
import { useLocationChange } from 'src/Base/components/Route/useLocationChange'

type TRoute = {
  children: ReactElement
  path: string
}

const Route = ({ path, children }: TRoute) => {
  useLocationChange()
  return window.location.pathname === path ? <>{children}</> : null
}

export default Route
