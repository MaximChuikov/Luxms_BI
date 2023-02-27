import { RefObject, useEffect } from 'react'
import { useLatest } from 'src/Base/hooks/useLatest'

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, callback: () => void) => {
  const latestCallback = useLatest(callback)
  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (ref.current && !ref.current.contains(evt.target as Node)) {
        latestCallback.current()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, latestCallback])
}
