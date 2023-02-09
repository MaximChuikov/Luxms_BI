import React, { ReactElement } from 'react'

type TLink = {
  className?: string
  href: string
  children: ReactElement | string
}

export const Link = ({ className, href, children }: TLink) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return // открытие в новой вкладке при клике с зажатым ctrl
    e.preventDefault()
    window.history.pushState({}, '', href)
    const navEvent = new PopStateEvent('popstate')
    window.dispatchEvent(navEvent) // диспатч события "изменение url-а" для Route
  }
  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  )
}
