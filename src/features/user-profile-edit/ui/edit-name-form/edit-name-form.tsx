import {
  changeUserNameFormDefaultValues,
  changeUserNameFormSchema,
  type TChangeUserNameFormValues,
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
    formState: { errors, isDirty, isValid },
  } = useForm<TChangeUserNameFormValues>({
    resolver: zodResolver(changeUserNameFormSchema),
    defaultValues: changeUserNameFormDefaultValues,
    mode: 'onChange',
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
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate style={{ width: '100%' }}>
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
              disabled={isLoading}
            >
              <Icon name="PenLine" size={24} color="#787B82" />
            </ActionIcon>
          }
        />
        <TextInput value={email} readOnly placeholder="Ваша почта" />
        <Button
          type="button"
          onClick={openPasswordForm}
          variant="outline"
          fullWidth
          disabled={!isViewMode || isLoading}
        >
          Сменить пароль
        </Button>
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isViewMode || !isDirty || !isValid || isLoading}
        >
          Сохранить
        </Button>
      </Stack>
    </form>
  )
}
