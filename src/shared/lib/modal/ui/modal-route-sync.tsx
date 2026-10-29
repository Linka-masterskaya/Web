import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { useModal } from '../hooks/use-modal'

export const ModalRouteSync: React.FC = () => {
  const { pathname } = useLocation()
  const { close, isOpen } = useModal()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return
    }

    pathnameRef.current = pathname

    if (isOpen) {
      close()
    }
  }, [pathname, isOpen, close])

  return null
}
