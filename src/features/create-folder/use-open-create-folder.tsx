import { useModal } from '@shared/lib/modal'
import { useCallback } from 'react'
import { CreateFolderModal } from './create-folder-modal'
import type { TOpenCreateFolderParams } from './types'

export const useOpenCreateFolder = () => {
  const { open, close } = useModal()

  return useCallback(
    ({ section = 'my', parentId = null, onSuccess }: TOpenCreateFolderParams = {}) => {
      open({
        content: (
          <CreateFolderModal
            section={section}
            parentId={parentId}
            onClose={close}
            onSuccess={onSuccess}
          />
        ),
        size: 518,
        padding: 0,
        radius: 20,
        withCloseButton: false,
      })
    },
    [close, open],
  )
}
