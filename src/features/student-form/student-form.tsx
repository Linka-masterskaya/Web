import {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_OPTIONS,
  studentFormDefaultValues,
  studentSchema,
  type TStudentCardsShift,
  type TStudentFormValues,
} from '@entities/student'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Center,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { AvatarUpload } from '@shared/ui/avatar'
import { Icon } from '@shared/ui/icon'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { z } from 'zod'
import styles from './student-form.module.scss'

const studentFormFieldsSchema = studentSchema.pick({
  name: true,
  email: true,
  age: true,
  status: true,
  cardsShift: true,
})

type TStudentFormFieldsValues = z.infer<typeof studentFormFieldsSchema>

export type TStudentFormSubmitMeta = {
  /** Аватар был удалён пользователем (для PATCH avatar_media_id: null) */
  avatarRemoved: boolean
}

export type TStudentFormProps = {
  defaultValues?: Partial<TStudentFormValues>
  initialAvatarUrl?: string | null
  onSubmit: (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => void | Promise<void>
}

export const StudentForm = ({ defaultValues, initialAvatarUrl, onSubmit }: TStudentFormProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(() => defaultValues?.avatarFile ?? null)
  const [avatarRemoved, setAvatarRemoved] = useState(false)
  const [isAvatarDirty, setIsAvatarDirty] = useState(false)
  const [currentAvatarSrc, setCurrentAvatarSrc] = useState<string | null>(initialAvatarUrl ?? null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(() =>
    defaultValues?.avatarFile ? URL.createObjectURL(defaultValues.avatarFile) : null,
  )
  const studentAgeOptions = useMemo(
    () =>
      Array.from({ length: STUDENT_AGE_MAX - STUDENT_AGE_MIN + 1 }, (_, i) => {
        const age = STUDENT_AGE_MIN + i
        return { value: String(age), label: `${age} лет` }
      }),
    [],
  )
  const mergedDefaultValues = useMemo<TStudentFormFieldsValues>(
    () => ({
      name: defaultValues?.name ?? studentFormDefaultValues.name,
      email: defaultValues?.email ?? studentFormDefaultValues.email,
      age: defaultValues?.age ?? studentFormDefaultValues.age,
      status: defaultValues?.status ?? studentFormDefaultValues.status,
      cardsShift: defaultValues?.cardsShift ?? studentFormDefaultValues.cardsShift,
    }),
    [defaultValues],
  )

  const form = useForm<TStudentFormFieldsValues>({
    resolver: zodResolver(studentFormFieldsSchema),
    defaultValues: mergedDefaultValues,
    // onTouched: ошибки показываются после ухода с поля и при отправке
    mode: 'onTouched',
  })

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting, isDirty, isLoading },
  } = form

  // Валидность считается по текущим значениям формы напрямую через схему:
  // RHF-овский isValid стартует false и при onTouched обновляется только после blur,
  // что ломало бы случай «изменён только аватар».
  const watchedValues = watch()
  const isValid = useMemo(
    () => studentFormFieldsSchema.safeParse(watchedValues).success,
    [watchedValues],
  )

  useEffect(() => {
    if (!previewSrc) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewSrc)
    }
  }, [previewSrc])

  const handleFormSubmit = (values: TStudentFormFieldsValues) =>
    onSubmit(
      {
        ...values,
        avatarFile,
      },
      { avatarRemoved },
    )

  const handleFileChange = (file: File) => {
    setPreviewSrc((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return URL.createObjectURL(file)
    })

    setAvatarFile(file)
    setAvatarRemoved(false)
    setIsAvatarDirty(true)
  }

  const handleDeleteAvatar = () => {
    setPreviewSrc((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }
      return null
    })
    setCurrentAvatarSrc(null)
    setAvatarFile(null)
    setAvatarRemoved(true)
    setIsAvatarDirty(true)
  }

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack>
        <Center>
          <AvatarUpload
            avatarSrc={previewSrc ?? currentAvatarSrc}
            initials={<Icon name="UserRound" size={50} color="var(--mantine-color-blue-4)" />}
            onReplace={handleFileChange}
            onDelete={handleDeleteAvatar}
            radius="50%"
          />
        </Center>

        <TextInput
          label="Имя ученика"
          placeholder="Введите имя"
          {...register('name')}
          error={errors.name?.message}
        />

        <TextInput
          type="email"
          label="Email"
          placeholder="Введите email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Group grow align="flex-start">
          <Controller
            control={control}
            name="age"
            render={({ field }) => (
              <Select
                label="Возраст"
                placeholder="Выберите возраст"
                data={studentAgeOptions}
                value={String(field.value)}
                onChange={(value) =>
                  field.onChange(value ? Number(value) : studentFormDefaultValues.age)
                }
                error={errors.age?.message}
                rightSection={<Icon name="ChevronDown" size={16} />}
                withCheckIcon={false}
                allowDeselect={false}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Статус"
                placeholder="Выберите статус"
                data={STUDENT_STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: STUDENT_STATUS_LABELS[status],
                }))}
                value={field.value}
                onChange={(value) => field.onChange(value ?? studentFormDefaultValues.status)}
                error={errors.status?.message}
                rightSection={<Icon name="ChevronDown" size={16} />}
                withCheckIcon={false}
                allowDeselect={false}
              />
            )}
          />
        </Group>

        <Group align="center" wrap="nowrap" gap={12} justify="flex-start">
          <Text fz="sm" fw={700} lh="20px" c="black">
            Смещение карточек в наборах
          </Text>
          <Controller
            control={control}
            name="cardsShift"
            render={({ field }) => (
              <SegmentedControl
                aria-label="Смещение карточек в наборах"
                value={field.value ?? studentFormDefaultValues.cardsShift}
                onChange={(value) => field.onChange(value as TStudentCardsShift)}
                data={[
                  {
                    value: 'left',
                    label: (
                      <span className={styles.shiftIcon}>
                        <Icon name="AlignLeft" size={24} color="var(--mantine-color-blue-5)" />
                      </span>
                    ),
                  },
                  {
                    value: 'full',
                    label: (
                      <span className={styles.shiftIcon}>
                        <Icon name="AlignJustify" size={24} color="var(--mantine-color-blue-5)" />
                      </span>
                    ),
                  },
                  {
                    value: 'right',
                    label: (
                      <span className={styles.shiftIcon}>
                        <Icon name="AlignRight" size={24} color="var(--mantine-color-blue-5)" />
                      </span>
                    ),
                  },
                ]}
                classNames={{
                  control: styles.shiftControl,
                  root: styles.shiftControlRoot,
                  indicator: styles.shiftControlIndicator,
                }}
                w={132}
              />
            )}
          />
        </Group>

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={(!isDirty && !isAvatarDirty) || !isValid || isLoading}
        >
          Сохранить
        </Button>
      </Stack>
    </form>
  )
}
