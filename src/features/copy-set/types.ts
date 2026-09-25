export type TCopySetTargetSection = 'my' | 'students'

export type TOpenCopySetParams = {
  setId: string
  targetSection?: TCopySetTargetSection
  onSuccess?: () => void
}

export type TCopySetModalProps = {
  setId: string
  targetSection: TCopySetTargetSection
  onSuccess?: () => void
  onClose: () => void
}
