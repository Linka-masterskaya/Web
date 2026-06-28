import {
  changeUserNameFormDefaultValues,
  changeUserNameFormSchema,
  type TChangeUserNameFormValues,
  useUserStore,
} from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionIcon, Button, Stack, TextInput } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TEditNameFormProps } from './types'

export const EditNameForm: React.FC<TEditNameFormProps> = ({
  name,
  email,
  onSubmit,
  openPasswordForm,
  isLoading,
  nameViewMode,
  onEditNameClick,
}) => {
  const isViewMode = nameViewMode === 'view'

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<TChangeUserNameFormValues>({
    resolver: zodResolver(changeUserNameFormSchema),
    defaultValues: changeUserNameFormDefaultValues,
  })

  useEffect(() => {
    reset({ name })
  }, [name, reset])

  useEffect(() => {
    if (!isViewMode) {
      setFocus('name')
    }
  }, [isViewMode, setFocus])

  const handleFormSubmit = async (values: TChangeUserNameFormValues) => {
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Stack gap="16px">
        <TextInput
          {...register('name')}
          type="text"
          placeholder="Ваше имя"
          readOnly={isViewMode}
          error={errors.name?.message}
          rightSectionPointerEvents="all"
          rightSection={
            <ActionIcon
              type="button"
              variant="subtle"
              color="gray"
              aria-label="Редактировать имя"
              onClick={onEditNameClick}
            >
              <Icon name="Pencil" size={24} />
            </ActionIcon>
          }
        />
        <TextInput value={email} readOnly />
        <Button type="button" onClick={openPasswordForm} variant="outline">
          Сменить пароль
        </Button>
        <Button type="submit" fullWidth loading={isLoading}>
          Сохранить
        </Button>
      </Stack>
    </form>
  )
}
