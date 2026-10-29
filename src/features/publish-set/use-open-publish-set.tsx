import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { PublishSetModal } from './publish-set-modal'
import type { TOpenPublishSetParams } from './types'

export const useOpenPublishSet = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ setId, onSuccess }: TOpenPublishSetParams) => {
      open({
        content: <PublishSetModal setId={setId} onClose={close} onSuccess={onSuccess} />,
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
