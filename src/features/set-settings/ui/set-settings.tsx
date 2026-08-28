import { zodResolver } from '@hookform/resolvers/zod'
import {
  Accordion,
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  SET_AGE_OPTIONS,
  SET_LEVEL_OPTIONS,
  SET_SETTINGS_DEFAULT_VALUES,
  SET_VOICE_OPTIONS,
} from '../config'
import { setSettingsSchema, type TSetSettings } from '../model/set-settings.schema'
import type { TSetSettingsProps } from '../types'
import styles from './set-settings.module.scss'

export const SetSettings = ({ defaultValues, onClose, onSave }: TSetSettingsProps) => {
  const form = useForm<TSetSettings>({
    resolver: zodResolver(setSettingsSchema),
    defaultValues: {
      ...SET_SETTINGS_DEFAULT_VALUES,
      ...defaultValues,
    },
    mode: 'onChange',
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = form

  const notes = useWatch({
    control,
    name: 'notes',
  })

  const [focused, setFocused] = useState(false)

  const handleFormSubmit = async (values: TSetSettings) => {
    await onSave?.(values)
  }

  return (
    <PopupLayout onClose={onClose} contentGap={0}>
      <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap={16} className={styles.wrapper}>
          <Title order={2} ta="center">
            Настройки
          </Title>

          <Stack gap={12}>
            <Text className={styles.sectionTitle}>Название набора</Text>

            <TextInput
              {...register('title')}
              label="Название"
              placeholder="Введите название набора"
              required
            />
          </Stack>

          <Stack gap={12}>
            <Text className={styles.sectionTitle}>Параметры набора</Text>
            <Group grow gap="sm">
              <Controller
                control={control}
                name="age"
                render={({ field }) => (
                  <Select
                    label="Возраст"
                    data={SET_AGE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      if (value !== null) {
                        field.onChange(value)
                      }
                    }}
                    withCheckIcon={false}
                    rightSection={<Icon name="ChevronDown" size={16} />}
                    rightSectionPointerEvents="none"
                    classNames={{
                      option: styles.selectOption,
                      dropdown: styles.selectDropdown,
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <Select
                    label="Уровень"
                    data={SET_LEVEL_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      if (value !== null) {
                        field.onChange(value)
                      }
                    }}
                    withCheckIcon={false}
                    rightSection={<Icon name="ChevronDown" size={16} />}
                    rightSectionPointerEvents="none"
                    classNames={{
                      option: styles.selectOption,
                      dropdown: styles.selectDropdown,
                    }}
                  />
                )}
              />
            </Group>
          </Stack>

          <Stack gap={12}>
            <Text className={styles.sectionTitle}>Голос озвучки</Text>
            <Flex align="flex-end" gap="sm">
              <Controller
                control={control}
                name="voice"
                render={({ field }) => (
                  <Select
                    flex={1}
                    data={SET_VOICE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      if (value !== null) {
                        field.onChange(value)
                      }
                    }}
                    withCheckIcon={false}
                    rightSection={<Icon name="ChevronDown" size={16} />}
                    rightSectionPointerEvents="none"
                    classNames={{
                      option: styles.selectOption,
                      dropdown: styles.selectDropdown,
                    }}
                  />
                )}
              />

              {/* TODO: подключить воспроизведение выбранного голоса после интеграции с API */}
              <Button
                variant="outline"
                leftSection={<Icon name="Play" size={16} />}
                classNames={{
                  root: styles.listenButton,
                  section: styles.listenButtonSection,
                  label: styles.listenButtonLabel,
                }}
              >
                Слушать
              </Button>
            </Flex>
          </Stack>

          <Stack gap={12}>
            <Text className={styles.sectionTitle}>Заметки к набору</Text>
            <Textarea
              {...register('notes')}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autosize
              minRows={1}
              maxRows={10}
              leftSection={
                !focused && !notes ? (
                  <Icon name="NotebookPen" size={20} color="var(--mantine-color-gray-6)" />
                ) : undefined
              }
              leftSectionPointerEvents="none"
              classNames={{
                input: styles.notesInput,
                section: styles.notesSection,
              }}
            />
          </Stack>

          <Accordion
            variant="transparent"
            classNames={{
              item: styles.accordionItem,
              control: styles.accordionControl,
              panel: styles.accordionPanel,
              content: styles.accordionContent,
              chevron: styles.accordionChevron,
            }}
          >
            <Accordion.Item value="interaction">
              <Accordion.Control>
                <span className={styles.accordionTitle}>Настройки взаимодействия</span>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack gap="sm">
                  <Controller
                    control={control}
                    name="isTypingPack"
                    render={({ field }) => (
                      <Group
                        wrap="nowrap"
                        gap="sm"
                        className={styles.settingRow}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Switch
                          checked={field.value}
                          readOnly
                          withThumbIndicator={false}
                          classNames={{
                            track: styles.switchTrack,
                          }}
                        />

                        <Text className={styles.settingLabel}>
                          Набор для печати текста (если создаете клавиатуру)
                        </Text>
                      </Group>
                    )}
                  />

                  <Controller
                    control={control}
                    name="isAutoSpeak"
                    render={({ field }) => (
                      <Group
                        wrap="nowrap"
                        gap="sm"
                        className={styles.settingRow}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Switch
                          checked={field.value}
                          readOnly
                          withThumbIndicator={false}
                          classNames={{
                            track: styles.switchTrack,
                          }}
                        />

                        <Text className={styles.settingLabel}>
                          Скрыть строку ввода и озвучивать карточку сразу при нажатии на нее
                        </Text>
                      </Group>
                    )}
                  />

                  <Controller
                    control={control}
                    name="isQuizPack"
                    render={({ field }) => (
                      <Group
                        wrap="nowrap"
                        gap="sm"
                        className={styles.settingRow}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <Switch
                          checked={field.value}
                          readOnly
                          withThumbIndicator={false}
                          classNames={{
                            track: styles.switchTrack,
                          }}
                        />

                        <Text className={styles.settingLabel}>Набор для викторины</Text>
                      </Group>
                    )}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Stack gap="sm" className={styles.footer} align="center">
            <Button
              className={styles.saveButton}
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty || !isValid}
            >
              Сохранить настройки
            </Button>
            <Text>Вы можете вернуться к этому шагу в любое время</Text>
          </Stack>
        </Stack>
      </form>
    </PopupLayout>
  )
}
