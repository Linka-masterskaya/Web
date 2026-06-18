import type { TChangeUserPasswordFormValues } from '@entities/user'
import { changeUserPasswordFormDefaultValues, changeUserPasswordFormSchema } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput } from '@mantine/core'
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
    mode: 'onChange',
    resolver: zodResolver(changeUserPasswordFormSchema),
    defaultValues: changeUserPasswordFormDefaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <PasswordInput
        placeholder="Новый пароль"
        className={styles.field}
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />

      <PasswordInput
        placeholder="Повторите пароль"
        className={styles.field}
        {...register('passwordConfirm')}
        error={errors.passwordConfirm?.message}
      />

      <Button type="submit" className={styles.submitButton} loading={isSubmitting}>
        Сменить пароль
      </Button>
    </form>
  )
}
