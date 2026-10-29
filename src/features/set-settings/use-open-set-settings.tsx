import type { TSet } from '@entities/set'
import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { EditSetSettingsModal } from './ui/edit-set-settings-modal'

export const useOpenSetSettings = () => {
  const { open, close } = useModal()

  return useCallback(
    (set: TSet) => {
      open({
        content: <EditSetSettingsModal set={set} onClose={close} />,
        size: 518,
        padding: 24,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
