import {
  editUserProfilePasswordFormSchema,
  editUserProfilePasswordFormSchemaDefaultValues,
  type TEditUserProfilePasswordFormValues,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput, Stack } from '@mantine/core'
import { useForm } from 'react-hook-form'
import type { TEditPasswordFormProps } from './types'

export const EditPasswordForm: React.FC<TEditPasswordFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEditUserProfilePasswordFormValues>({
    resolver: zodResolver(editUserProfilePasswordFormSchema),
    defaultValues: editUserProfilePasswordFormSchemaDefaultValues,
  })

  const handleUpdatePasswordSubmit = async (values: TEditUserProfilePasswordFormValues) => {
    await onSubmit(values)

    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleUpdatePasswordSubmit)} noValidate>
      <Stack gap="16px">
        <PasswordInput
          {...register('oldPassword')}
          placeholder="Введите старый пароль"
          error={errors.oldPassword?.message}
        />
        <PasswordInput
          {...register('newPassword')}
          placeholder="Введите новый пароль"
          error={errors.newPassword?.message}
        />
        <PasswordInput
          {...register('passwordConfirm')}
          placeholder="Повторите новый пароль"
          error={errors.passwordConfirm?.message}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Сменить пароль
        </Button>
      </Stack>
    </form>
  )
}
