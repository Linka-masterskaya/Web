export type TCreatedSet = {
  id: string
  folderId: string
}

export type TOpenCreateSetParams = {
  folderId?: string | null
}

export type TCreateSetModalProps = TOpenCreateSetParams & {
  onClose: () => void
}
