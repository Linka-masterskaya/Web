import type { TCopySetTargetSection } from './copy-set.schema'

export type TCopySetModalProps = {
  setId: string
  setName?: string
  targetSection: TCopySetTargetSection
  className?: string
  onClose: () => void
  onSuccess?: () => void
}

export type TOpenCopySetParams = Omit<TCopySetModalProps, 'className' | 'onClose'>
