import {
  changeUserNameFormDefaultValues,
  changeUserNameFormSchema,
  type TChangeUserNameFormValues,
  useUserStore,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import type { TEditNameFormProps } from './types'

export const EditNameForm: React.FC<TEditNameFormProps> = ({
  onSubmit,
  openPasswordForm,
  isLoading,
}) => {
  const email = useUserStore((state) => state.email)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TChangeUserNameFormValues>({
    resolver: zodResolver(changeUserNameFormSchema),
    defaultValues: changeUserNameFormDefaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="16px">
        <TextInput
          {...register('name')}
          type="text"
          placeholder="Ваше имя"
          error={errors.name?.message}
        />
        <TextInput value={email ?? ''} readOnly />
        <Button type="button" onClick={openPasswordForm} variant="outline">
          Сменить пароль
        </Button>
        <Button type="submit" fullWidth loading={isLoading}>
          Восстановить аккаунт
        </Button>
      </Stack>
    </form>
  )
}
