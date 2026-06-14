import type { TChangeUserPasswordFormValues } from '@entities/user'
import { changeUserPasswordFormDefaultValues, changeUserPasswordFormSchema } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput } from '@mantine/core'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import styles from './change-user-password-form.module.css'

export type TChangeUserPasswordFormProps = {
  onSubmit: (values: TChangeUserPasswordFormValues) => void | Promise<void>
}

export const ChangeUserPasswordForm: React.FC<TChangeUserPasswordFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TChangeUserPasswordFormValues>({
    resolver: zodResolver(changeUserPasswordFormSchema),
    defaultValues: changeUserPasswordFormDefaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={clsx(styles.form)}>
      <PasswordInput
        placeholder="Новый пароль"
        className={clsx(styles.field)}
        classNames={{ input: styles.fieldInput, error: styles.fieldError }}
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />

      <PasswordInput
        placeholder="Повторите пароль"
        className={clsx(styles.field)}
        classNames={{ input: styles.fieldInput, error: styles.fieldError }}
        {...register('passwordConfirm')}
        error={errors.passwordConfirm?.message}
      />

      <Button type="submit" className={clsx(styles.submitButton)} loading={isSubmitting}>
        Сменить пароль
      </Button>
    </form>
  )
}
