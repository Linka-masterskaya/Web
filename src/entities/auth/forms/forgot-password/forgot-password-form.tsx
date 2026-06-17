import {
  forgotPasswordFormDefaultValues,
  forgotPasswordFormSchema,
  type TForgotPasswordFormValues,
} from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import type { TForgotPasswordFormProps } from './types'

export const ForgotPasswordForm: React.FC<TForgotPasswordFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: forgotPasswordFormDefaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="20px">
        <TextInput
          {...register('email')}
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
        />
        <Button type="submit" fullWidth loading={isSubmitting}>
          Восстановить аккаунт
        </Button>
      </Stack>
    </form>
  )
}
