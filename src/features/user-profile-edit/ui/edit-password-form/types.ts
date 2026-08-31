import type { TEditUserProfilePasswordFormValues } from '@entities/user'

export type TEditPasswordFormProps = {
  onSubmit: (values: TEditUserProfilePasswordFormValues) => boolean | Promise<boolean>
  isLoading: boolean
  submitError?: string | null
  onFieldChange?: () => void
}
