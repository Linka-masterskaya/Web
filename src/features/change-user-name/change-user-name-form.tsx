import {
  changeUserNameFormDefaultValues,
  changeUserNameFormSchema,
  type TChangeUserNameFormValues,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'

export type TChangeUserNameFormProps = {
  defaultValues?: Partial<TChangeUserNameFormValues>
  onSubmit: (values: TChangeUserNameFormValues) => void | Promise<void>
}

export const ChangeUserNameForm = ({ defaultValues, onSubmit }: TChangeUserNameFormProps) => {
  const form = useForm<TChangeUserNameFormValues>({
    resolver: zodResolver(changeUserNameFormSchema),
    defaultValues: { ...changeUserNameFormDefaultValues, ...defaultValues },
    mode: 'onSubmit',
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        autoComplete="name"
        placeholder="Ваше имя"
        {...register('name')}
        error={errors.name?.message}
      />

      <Button type="submit" loading={isSubmitting}>
        Сохранить
      </Button>
    </form>
  )
}
