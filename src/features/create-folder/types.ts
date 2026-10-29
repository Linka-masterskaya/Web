import type { TSection } from '@entities/folder'

export type TOpenCreateFolderParams = {
  section?: TSection
  parentId?: string | null
  onSuccess?: () => void
}

export type TCreateFolderModalProps = TOpenCreateFolderParams & {
  onClose: () => void
}
