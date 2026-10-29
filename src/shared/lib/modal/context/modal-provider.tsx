import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TModalOpenParams, TModalOptions, TModalProviderProps } from '../types'
import { AppModal } from '../ui/app-modal'
import { ModalRouteSync } from '../ui/modal-route-sync'
import { ModalContext } from './modal-context'

type TModalState = {
  content: ReactNode
  options: TModalOptions
}

export const ModalProvider: React.FC<TModalProviderProps> = ({ children }) => {
  const [opened, setOpened] = useState(false)
  const [modalState, setModalState] = useState<TModalState | null>(null)
  const onCloseRef = useRef<(() => void) | undefined>(undefined)
  const openedRef = useRef(false)

  const close = useCallback(() => {
    onCloseRef.current?.()
    onCloseRef.current = undefined
    openedRef.current = false
    setOpened(false)
  }, [])

  const handleExited = useCallback(() => {
    if (openedRef.current) {
      return
    }

    setModalState(null)
  }, [])

  const open = useCallback((params: TModalOpenParams) => {
    const { content, onClose, ...options } = params

    onCloseRef.current = onClose
    openedRef.current = true
    setOpened(false)
    setModalState({ content, options })
  }, [])

  useEffect(() => {
    if (!modalState || !openedRef.current) {
      return
    }

    const frameId = requestAnimationFrame(() => {
      if (openedRef.current) {
        setOpened(true)
      }
    })

    return () => cancelAnimationFrame(frameId)
  }, [modalState])

  return (
    <ModalContext.Provider value={{ isOpen: opened, open, close }}>
      <ModalRouteSync />
      {children}
      {modalState !== null && (
        <AppModal
          opened={opened}
          content={modalState.content}
          options={modalState.options}
          onClose={close}
          onExited={handleExited}
        />
      )}
    </ModalContext.Provider>
  )
}
