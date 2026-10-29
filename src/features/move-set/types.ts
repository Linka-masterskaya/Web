export type TOpenMoveSetParams = {
  setId: string
  onSuccess?: () => void
}

export type TMoveSetModalProps = TOpenMoveSetParams & {
  onClose: () => void
}
