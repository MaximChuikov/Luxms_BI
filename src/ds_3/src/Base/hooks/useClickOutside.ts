import { RefObject, useEffect } from 'react'

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (ref.current && !ref.current.contains(evt.target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}
