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
  const form = useForm<TForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: forgotPasswordFormDefaultValues,
  })

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form

  const clearSubmitError = () => clearErrors('email')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="20px">
        <TextInput
          {...register('email', {
            onChange: clearSubmitError,

            onBlur: (event) => {
              const value = event.target.value.trim()

              form.setValue('email', value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            },
          })}
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
