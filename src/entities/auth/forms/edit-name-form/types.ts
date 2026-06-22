import type { TChangeUserNameFormValues } from '@entities/user'
import type { TUserNameViewMode } from '@features/user-profile-edit/types'

export type TEditNameFormProps = {
  onSubmit: (values: TChangeUserNameFormValues) => unknown | Promise<unknown>
  openPasswordForm: () => void
  isLoading: boolean
  nameViewMode: TUserNameViewMode
  onEditNameClick: () => void
}
