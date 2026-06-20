import {
  registerFormDefaultValues,
  registerFormSchema,
  type TRegisterFormValues,
} from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
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
    formState: { errors, isSubmitting },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack className={styles.fields}>
        <TextInput
          type="text"
          placeholder="Имя"
          {...register('name')}
          error={errors.name?.message}
        />

        <TextInput
          type="email"
          autoComplete="email"
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Пароль"
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Повторите пароль"
          {...register('passwordConfirm')}
          error={errors.passwordConfirm?.message}
        />

        <Button
          type="submit"
          loading={isSubmitting}
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
