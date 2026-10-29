import type { TSection } from '@entities/section-content'

export type TCreatedSet = {
  id: string
  folderId: string
}

export type TOpenCreateSetParams = {
  folderId?: string | null
  studentId?: string
  section?: TSection
}

export type TCreateSetModalProps = TOpenCreateSetParams & {
  onClose: () => void
}
