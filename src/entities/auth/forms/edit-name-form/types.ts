import type { TChangeUserNameFormValues } from '@entities/user'

export type TEditNameFormProps = {
  onSubmit: (values: TChangeUserNameFormValues) => unknown | Promise<unknown>
  openPasswordForm: () => void
  isLoading: boolean
}
