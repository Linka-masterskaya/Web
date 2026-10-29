import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { SendSet } from './send-set'
import type { TOpenSendSetParams } from './types'

export const useOpenSendSet = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ setId, onSuccess }: TOpenSendSetParams) => {
      open({
        content: <SendSet setId={setId} onClose={close} onSuccess={onSuccess} />,
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
