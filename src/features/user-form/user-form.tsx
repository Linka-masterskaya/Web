import { type TUserFormValues, userFormDefaultValues, userFormSchema } from '@entities/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Flex, Input, JsonInput, MaskInput, Stack, Switch, TextInput } from '@mantine/core'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export const UserForm: React.FC = () => {
  const [jsonPreview, setJsonPreview] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserFormValues>({
    resolver: zodResolver(userFormSchema), // Automatically validates the form
    defaultValues: userFormDefaultValues, // initial values for the form
    mode: 'onBlur', // 'onChange', 'onBlur', 'onSubmit', 'onTouched', 'all'
  })

  const handleShowValues = handleSubmit((values) => {
    setJsonPreview(JSON.stringify(values, null, 2))
  })

  return (
    <Flex gap="xl">
      <Stack gap="md" maw={480}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="First name"
              placeholder="John"
              withAsterisk
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label="Last name"
              placeholder="Doe"
              error={errors.lastName?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <MaskInput
              label="Phone"
              mask="+7 (999) 999-99-99"
              placeholder="+7 (___) ___-__-__"
              defaultValue={field.value}
              onChangeRaw={field.onChange}
              onBlur={field.onBlur}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              type="email"
              label="Email"
              placeholder="john@example.com"
              withAsterisk
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name="privacyPolicy"
          control={control}
          render={({ field }) => (
            <Switch
              label={<Input.Label required>Privacy policy</Input.Label>}
              description="I agree to the processing of personal data"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              onBlur={field.onBlur}
              error={errors.privacyPolicy?.message}
            />
          )}
        />

        <Button type="button" onClick={handleShowValues}>
          Show form values
        </Button>
      </Stack>

      <JsonInput
        label="Form values (react-hook-form)"
        placeholder="Click the button above to see the form object"
        value={jsonPreview}
        disabled
        autosize
        minRows={4}
      />
    </Flex>
  )
}
