import { loginFormDefaultValues, loginFormSchema, type TLoginFormValues } from '@entities/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Anchor, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

export type TLoginFormProps = {
  onSubmit: (values: TLoginFormValues) => void | Promise<void>
}

export const LoginForm = ({ onSubmit }: TLoginFormProps) => {
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
    mode: 'onSubmit',
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput placeholder="Email" {...register('email')} error={errors.email?.message} />

        <PasswordInput
          placeholder="Пароль"
          {...register('password')}
          error={errors.password?.message}
        />

        <Anchor component={Link} to="/auth/forgot-password">
          Забыли пароль?
        </Anchor>

        <Button type="submit" loading={isSubmitting} variant="filled">
          Войти
        </Button>
        <Button component={Link} to="/register" variant="outline">
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  )
}
