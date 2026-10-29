import {
  registerFormDefaultValues,
  registerFormSchema,
  type TRegisterFormValues,
} from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { isHTTPError } from 'ky'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import styles from './register-form.module.scss'

export type TRegisterFormProps = {
  onSubmit: (values: TRegisterFormValues) => void | Promise<void>
}

export const RegisterForm = ({ onSubmit }: TRegisterFormProps) => {
  const form = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    register,
    clearErrors,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = form

  const submit = async (values: TRegisterFormValues) => {
    clearErrors('root')

    try {
      await onSubmit(values)
    } catch (error) {
      const message =
        isHTTPError(error) && error.response.status === 429
          ? 'Слишком много попыток. Попробуйте позже.'
          : 'Не удалось зарегистрироваться. Попробуйте ещё раз.'

      setError('root', { message })
    }
  }

  const clearSubmitError = () => clearErrors('root')

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Stack className={styles.fields}>
        {errors.root?.message && <Text className={styles.submitError}>{errors.root.message}</Text>}

        <TextInput
          type="text"
          autoComplete="name"
          placeholder="Имя"
          {...register('name', { onChange: clearSubmitError })}
          error={errors.name?.message ?? Boolean(errors.root)}
        />

        <TextInput
          type="email"
          autoComplete="email"
          placeholder="Email"
          {...register('email', { onChange: clearSubmitError })}
          error={errors.email?.message ?? Boolean(errors.root)}
        />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Пароль"
          {...register('password', { onChange: clearSubmitError })}
          error={errors.password?.message ?? Boolean(errors.root)}
        />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Повторите пароль"
          {...register('passwordConfirm', { onChange: clearSubmitError })}
          error={errors.passwordConfirm?.message ?? Boolean(errors.root)}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          variant="filled"
          className={styles.submitButton}
        >
          Зарегистрироваться
        </Button>
      </Stack>

      <Text className={styles.agreement}>
        Регистрируясь, вы соглашаетесь с условиями{' '}
        <Anchor
          component={Link}
          to={createUrl(routerPath.privacyPolicy)}
          className={styles.agreementLink}
        >
          Политики обработки персональных данных
        </Anchor>
      </Text>
    </form>
  )
}
