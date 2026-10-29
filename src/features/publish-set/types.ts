export type TOpenPublishSetParams = {
  setId: string
  onSuccess?: () => void
}

export type TPublishSetModalProps = TOpenPublishSetParams & {
  onClose: () => void
}
