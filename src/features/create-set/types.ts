export type TOpenCreateSetParams = {
  folderId?: string | null
  onSuccess?: () => void
}

export type TCreateSetModalProps = TOpenCreateSetParams & {
  onClose: () => void
}
