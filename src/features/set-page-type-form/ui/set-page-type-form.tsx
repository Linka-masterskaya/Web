import { AssignmentTypeSelector } from '@features/assignment-type-selector'
import { isSetPageType, SET_PAGE_TYPE_OPTIONS } from '@features/set-page-type-selector'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { SubsetLayout } from '@widgets/subset-layout'

import styles from '../set-page-type-form.module.scss'
import type { TSetPageTypeFormProps } from '../types'

export const SetPageTypeForm: React.FC<TSetPageTypeFormProps> = ({
  title,
  description,
  value,
  onChange,
  onBack,
  backLabel = 'К набору',
  onCancel,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  isSubmitDisabled = false,
  errorMessage = null,
}) => {
  const handleTypeChange = (nextValue: string) => {
    if (isSetPageType(nextValue)) {
      onChange(nextValue)
    }
  }

  return (
    <Stack gap="lg">
      <Button
        variant="subtle"
        w="fit-content"
        leftSection={<Icon name="ArrowLeft" size={16} />}
        onClick={onBack}
      >
        {backLabel}
      </Button>

      <Title order={2}>{title}</Title>

      <SubsetLayout
        leftSlot={
          <AssignmentTypeSelector
            value={value}
            options={[...SET_PAGE_TYPE_OPTIONS]}
            onChange={handleTypeChange}
          />
        }
      >
        <Stack gap="md" className={styles.content}>
          <Text c="dimmed">{description}</Text>

          {errorMessage && (
            <Text c="red.6" size="sm" role="alert">
              {errorMessage}
            </Text>
          )}

          <Group>
            <Button variant="default" onClick={onCancel}>
              Отмена
            </Button>
            <Button loading={isSubmitting} disabled={isSubmitDisabled} onClick={onSubmit}>
              {submitLabel}
            </Button>
          </Group>
        </Stack>
      </SubsetLayout>
    </Stack>
  )
}
