import {
  editUserProfilePasswordFormSchema,
  editUserProfilePasswordFormSchemaDefaultValues,
  type TEditUserProfilePasswordFormValues,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput, Stack, Text } from '@mantine/core'
import { useForm } from 'react-hook-form'
import type { TEditPasswordFormProps } from './types'

export const EditPasswordForm: React.FC<TEditPasswordFormProps> = ({
  onSubmit,
  isLoading,
  submitError,
  onFieldChange,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<TEditUserProfilePasswordFormValues>({
    resolver: zodResolver(editUserProfilePasswordFormSchema),
    defaultValues: editUserProfilePasswordFormSchemaDefaultValues,
    mode: 'onChange',
  })

  const handleUpdatePasswordSubmit = async (values: TEditUserProfilePasswordFormValues) => {
    const isSuccess = await onSubmit(values)

    if (isSuccess) {
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpdatePasswordSubmit)} noValidate>
      <Stack gap="16px">
        {submitError && (
          <Text c="red.6" size="sm" role="alert">
            {submitError}
          </Text>
        )}
        <PasswordInput
          {...register('oldPassword', { onChange: onFieldChange })}
          placeholder="Введите старый пароль"
          error={errors.oldPassword?.message}
        />
        <PasswordInput
          {...register('newPassword', { onChange: onFieldChange })}
          placeholder="Введите новый пароль"
          error={errors.newPassword?.message}
        />
        <PasswordInput
          {...register('passwordConfirm', { onChange: onFieldChange })}
          placeholder="Повторите новый пароль"
          error={errors.passwordConfirm?.message}
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!isDirty || !isValid || isLoading}
        >
          Сменить пароль
        </Button>
      </Stack>
    </form>
  )
}
