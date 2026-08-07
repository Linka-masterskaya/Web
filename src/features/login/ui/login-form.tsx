import { loginFormDefaultValues, loginFormSchema, type TLoginFormValues } from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Anchor, Button, PasswordInput, Text, TextInput } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import styles from './login-form.module.scss'

export type TLoginFormProps = {
  onSubmit: (values: TLoginFormValues) => void | Promise<void>
}

export const LoginForm = ({ onSubmit }: TLoginFormProps) => {
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
    mode: 'onChange',
  })

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form

  const submit = async (values: TLoginFormValues) => {
    clearErrors('root')

    try {
      await onSubmit(values)
    } catch {
      setError('root', { message: 'Вы ввели неверные данные. Попробуйте еще раз.' })
    }
  }

  const clearSubmitError = () => clearErrors('root')

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <div className={styles.fields}>
        <div className={styles.emailGroup}>
          {errors.root?.message && (
            <Text className={styles.submitError}>{errors.root.message}</Text>
          )}

          <TextInput
            type="email"
            autoComplete="email"
            placeholder="Email"
            {...register('email', { onChange: clearSubmitError })}
            error={errors.email?.message ?? Boolean(errors.root)}
          />
        </div>

        <PasswordInput
          autoComplete="current-password"
          placeholder="Пароль"
          {...register('password', { onChange: clearSubmitError })}
          error={errors.password?.message ?? Boolean(errors.root)}
        />

        <Anchor
          component={Link}
          to={createUrl(routerPath.authForgotPassword)}
          className={styles.forgotPassword}
        >
          Забыли пароль
        </Anchor>

        <Button type="submit" loading={isSubmitting} variant="filled" className={styles.button}>
          Войти
        </Button>

        <Button
          component={Link}
          to={createUrl(routerPath.authRegister)}
          variant="outline"
          className={styles.button}
        >
          Зарегистрироваться
        </Button>
      </div>
    </form>
  )
}
