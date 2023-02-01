import { useEffect, useState } from 'react'

export const useLocationChange = () => {
  const [, setCurrentPath] = useState(window.location.pathname)
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', onLocationChange)
    return () => window.removeEventListener('popstate', onLocationChange)
  })
}
