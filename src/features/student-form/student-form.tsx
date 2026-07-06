import {
  STUDENT_AGE_MAX,
  STUDENT_AGE_MIN,
  STUDENT_STATE_LABELS,
  STUDENT_STATE_OPTIONS,
  studentFormDefaultValues,
  studentSchema,
  type TStudentFormValues,
} from '@entities/student'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Center, Group, Select, Stack, TextInput } from '@mantine/core'
import { AvatarUpload } from '@shared/ui/avatar'
import { Icon } from '@shared/ui/icon'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { z } from 'zod'

const studentFormFieldsSchema = studentSchema.pick({
  name: true,
  email: true,
  age: true,
  state: true,
})

type TStudentFormFieldsValues = z.infer<typeof studentFormFieldsSchema>

export type TStudentFormProps = {
  defaultValues?: Partial<TStudentFormValues>
  initialAvatarUrl?: string | null
  onSubmit: (values: TStudentFormValues) => void | Promise<void>
}

export const StudentForm = ({ defaultValues, initialAvatarUrl, onSubmit }: TStudentFormProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(() => defaultValues?.avatarFile ?? null)
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
      state: defaultValues?.state ?? studentFormDefaultValues.state,
    }),
    [defaultValues],
  )

  const form = useForm<TStudentFormFieldsValues>({
    resolver: zodResolver(studentFormFieldsSchema),
    defaultValues: mergedDefaultValues,
    mode: 'onSubmit',
  })

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    if (!previewSrc) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewSrc)
    }
  }, [previewSrc])

  const handleFormSubmit = (values: TStudentFormFieldsValues) =>
    onSubmit({
      ...values,
      avatarFile,
    })

  const handleFileChange = (file: File) => {
    setPreviewSrc((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return URL.createObjectURL(file)
    })

    setAvatarFile(file)
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
            radius="var(--mantine-radius-default)"
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
            name="state"
            render={({ field }) => (
              <Select
                label="Статус"
                placeholder="Выберите статус"
                data={STUDENT_STATE_OPTIONS.map((state) => ({
                  value: state,
                  label: STUDENT_STATE_LABELS[state],
                }))}
                value={field.value}
                onChange={(value) => field.onChange(value ?? studentFormDefaultValues.state)}
                error={errors.state?.message}
                rightSection={<Icon name="ChevronDown" size={16} />}
                withCheckIcon={false}
                allowDeselect={false}
              />
            )}
          />
        </Group>

        <Button type="submit" loading={isSubmitting}>
          Сохранить
        </Button>
      </Stack>
    </form>
  )
}
