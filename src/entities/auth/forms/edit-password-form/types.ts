import type { TChangeUserPasswordFormValues } from '@entities/user'

export type TEditNameFormProps = {
  onSubmit: (values: TChangeUserPasswordFormValues) => unknown | Promise<unknown>
}
