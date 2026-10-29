import {
  resendVerificationFormSchema,
  type TResendVerificationFormValues,
  useResendVerificationEmail,
} from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, Text, TextInput } from '@mantine/core'
import { isHTTPError } from 'ky'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './resend-email-verification.module.scss'

type TResendEmailVerificationProps = {
  defaultEmail?: string
}

export const ResendEmailVerification = ({ defaultEmail = '' }: TResendEmailVerificationProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const resendVerification = useResendVerificationEmail()
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = useForm<TResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationFormSchema),
    defaultValues: { email: defaultEmail },
    mode: 'onChange',
  })

  const submit = async (values: TResendVerificationFormValues) => {
    clearErrors('root')

    try {
      await resendVerification.mutateAsync(values)
      setIsSubmitted(true)
    } catch (error) {
      const message =
        isHTTPError(error) && error.response.status === 429
          ? 'Слишком много запросов. Попробуйте отправить письмо позже.'
          : 'Не удалось отправить письмо. Попробуйте ещё раз.'

      setError('root', { message })
    }
  }

  if (isSubmitted) {
    return (
      <Text size="sm" className={styles.successText} role="status">
        Запрос принят. Если аккаунт существует и email ещё не подтверждён, письмо будет отправлено.
      </Text>
    )
  }

  return (
    <Stack gap="md">
      <Text size="sm" className={styles.text}>
        Укажите email, использованный при регистрации. Мы отправим новую ссылку подтверждения.
      </Text>

      <form onSubmit={handleSubmit(submit)} noValidate>
        <Stack gap="20px">
          {errors.root?.message && (
            <Text size="sm" className={styles.errorText} role="alert">
              {errors.root.message}
            </Text>
          )}

          <TextInput
            {...register('email', { onChange: () => clearErrors('root') })}
            type="email"
            placeholder="Email"
            autoComplete="email"
            error={errors.email?.message}
          />

          <Button
            type="submit"
            fullWidth
            loading={resendVerification.isPending}
            disabled={!isValid || resendVerification.isPending}
          >
            Отправить письмо
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
