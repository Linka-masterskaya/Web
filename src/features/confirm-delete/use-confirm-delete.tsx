import { useModal } from '@shared/lib/modal'
import { ConfirmDelete } from './confirm-delete'
import type { TConfirmDeleteParams } from './types'

export const useConfirmDelete = () => {
  const { open } = useModal()

  return (params: TConfirmDeleteParams) => {
    open({
      content: <ConfirmDelete {...params} />,
      withCloseButton: false,
      radius: 20,
      size: 360,
      padding: 20,
    })
  }
}
