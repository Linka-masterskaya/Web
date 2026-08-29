import type { MouseEvent as ReactMouseEvent } from 'react'
import { useCallback, useState } from 'react'
import type { TContextMenuPosition } from './types'

type TUseContextMenuOptions = {
  width?: number
  estimatedHeight?: number
  viewportMargin?: number
}

export function useContextMenu<TTarget extends object>({
  width = 235,
  estimatedHeight = 130,
  viewportMargin = 8,
}: TUseContextMenuOptions = {}) {
  const [target, setTarget] = useState<TTarget | null>(null)

  const [position, setPosition] = useState<TContextMenuPosition>({
    x: 0,
    y: 0,
  })

  const [opened, setOpened] = useState(false)

  const close = useCallback(() => {
    setOpened(false)
    setTarget(null)
  }, [])

  const open = useCallback(
    (event: ReactMouseEvent<HTMLElement>, nextTarget: TTarget) => {
      event.preventDefault()

      const maxX = Math.max(viewportMargin, window.innerWidth - width - viewportMargin)

      const maxY = Math.max(viewportMargin, window.innerHeight - estimatedHeight - viewportMargin)

      const x = Math.min(Math.max(event.clientX, viewportMargin), maxX)

      const y = Math.min(Math.max(event.clientY, viewportMargin), maxY)

      setPosition({ x, y })
      setTarget(nextTarget)
      setOpened(true)
    },
    [estimatedHeight, viewportMargin, width],
  )

  return {
    close,
    open,
    menuProps: {
      opened,
      target,
      position,
      width,
      onClose: close,
    },
  }
}
