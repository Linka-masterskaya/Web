import type { TEditUserProfilePasswordFormValues } from '@entities/user'

export type TEditPasswordFormProps = {
  onSubmit: (values: TEditUserProfilePasswordFormValues) => unknown | Promise<unknown>
  isLoading: boolean
}
