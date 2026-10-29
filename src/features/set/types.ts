export type TSendSetProps = {
  setId: string
  className?: string
  onClose?: () => void
  onSuccess?: () => void
}

export type TOpenSendSetParams = Pick<TSendSetProps, 'setId' | 'onSuccess'>
