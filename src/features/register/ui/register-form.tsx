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

export type TRegisterFormProps = {
  onSubmit: (values: TRegisterFormValues) => void | Promise<void>
}

export const RegisterForm = ({ onSubmit }: TRegisterFormProps) => {
  const form = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormDefaultValues,
    mode: 'onSubmit',
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md">
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
          autoComplete="off"
          placeholder="Повторите пароль"
          {...register('passwordConfirm')}
          error={errors.passwordConfirm?.message}
        />
        <Button type="submit" loading={isSubmitting} variant="filled">
          Зарегистрироваться
        </Button>
        <Text size="xs" c="gray.6" ta="center">
          Регистрируясь, вы соглашаетесь с условиями{' '}
          <Anchor
            component={Link}
            to={createUrl(routerPath.privacyPolicy)}
            c="gray.6"
            td="underline"
          >
            Политики обработки персональных данных
          </Anchor>
        </Text>
      </Stack>
    </form>
  )
}
