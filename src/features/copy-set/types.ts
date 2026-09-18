export type TOpenCopySetParams = {
  setId: string
  onSuccess?: () => void
}

export type TCopySetModalProps = TOpenCopySetParams & {
  onClose: () => void
}
