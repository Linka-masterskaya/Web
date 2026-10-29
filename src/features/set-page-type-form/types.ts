import type { TSetPageType } from '@entities/set'

export type TSetPageTypeFormProps = {
  title: string
  description: string
  value: TSetPageType
  onChange: (type: TSetPageType) => void
  onCancel: () => void
  onSubmit: () => void
  submitLabel: string
  isSubmitting?: boolean
  isSubmitDisabled?: boolean
  errorMessage?: string | null
}
