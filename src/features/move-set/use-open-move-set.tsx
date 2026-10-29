import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { MoveSetModal } from './move-set-modal'
import type { TOpenMoveSetParams } from './types'

export const useOpenMoveSet = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ setId, onSuccess }: TOpenMoveSetParams) => {
      open({
        content: <MoveSetModal setId={setId} onClose={close} onSuccess={onSuccess} />,
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
