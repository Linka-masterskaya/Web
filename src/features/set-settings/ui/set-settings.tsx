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
  Title,
} from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import {
  SET_AGE_OPTIONS,
  SET_LEVEL_OPTIONS,
  SET_SETTINGS_DEFAULT_VALUES,
  SET_VOICE_OPTIONS,
  type TSetLevel,
  type TSetVoice,
} from '../config'
import type { TSetSettingsProps } from '../types'
import styles from './set-settings.module.scss'

export const SetSettings = ({ onClose, onSave }: TSetSettingsProps) => {
  // TODO: добавить initialValues для редактирования сохраненных настроек

  const [age, setAge] = useState(SET_SETTINGS_DEFAULT_VALUES.age)
  const [level, setLevel] = useState<TSetLevel>(SET_SETTINGS_DEFAULT_VALUES.level)
  const [voice, setVoice] = useState<TSetVoice>(SET_SETTINGS_DEFAULT_VALUES.voice)

  const [notes, setNotes] = useState(SET_SETTINGS_DEFAULT_VALUES.notes)
  const [focused, setFocused] = useState(false)

  const [isTypingPack, setIsTypingPack] = useState(SET_SETTINGS_DEFAULT_VALUES.isTypingPack)

  const [isAutoSpeak, setIsAutoSpeak] = useState(SET_SETTINGS_DEFAULT_VALUES.isAutoSpeak)

  const [isQuizPack, setIsQuizPack] = useState(SET_SETTINGS_DEFAULT_VALUES.isQuizPack)

  const handleSave = () => {
    // TODO: подключить сохранение настроек через API
    onSave?.({
      age,
      level,
      voice,
      notes,
      isTypingPack,
      isAutoSpeak,
      isQuizPack,
    })

    onClose?.()
  }

  return (
    <PopupLayout onClose={onClose} contentGap={0}>
      <Stack gap="xl" className={styles.wrapper}>
        <Title order={2} ta="center">
          Настройки
        </Title>

        <Stack gap={12}>
          <Text className={styles.sectionTitle}>Параметры набора</Text>
          <Group grow gap="sm">
            <Select
              label="Возраст"
              data={SET_AGE_OPTIONS}
              value={age}
              onChange={(value) => {
                if (value !== null) {
                  setAge(value)
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

            <Select
              label="Уровень"
              data={SET_LEVEL_OPTIONS}
              value={level}
              onChange={(value) => {
                if (value !== null) {
                  setLevel(value as TSetLevel)
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
          </Group>
        </Stack>

        <Stack gap={12}>
          <Text className={styles.sectionTitle}>Голос озвучки</Text>
          <Flex align="flex-end" gap="sm">
            {/* TODO: добавить в выпадающий список кнопку «Добавить голос» */}
            <Select
              flex={1}
              data={SET_VOICE_OPTIONS}
              value={voice}
              onChange={(value) => {
                if (value !== null) {
                  setVoice(value as TSetVoice)
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
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
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
                <Group wrap="nowrap" gap="sm" className={styles.settingRow}>
                  <Switch
                    checked={isTypingPack}
                    onChange={(event) => setIsTypingPack(event.currentTarget.checked)}
                    withThumbIndicator={false}
                    classNames={{
                      track: styles.switchTrack,
                    }}
                  />
                  <Text className={styles.settingLabel}>
                    Набор для печати текста (если создаете клавиатуру)
                  </Text>
                </Group>

                <Group wrap="nowrap" gap="sm" className={styles.settingRow}>
                  <Switch
                    checked={isAutoSpeak}
                    onChange={(event) => setIsAutoSpeak(event.currentTarget.checked)}
                    withThumbIndicator={false}
                    classNames={{
                      track: styles.switchTrack,
                    }}
                  />
                  <Text className={styles.settingLabel}>
                    Скрыть строку ввода и озвучивать карточку сразу при нажатии на нее
                  </Text>
                </Group>

                <Group wrap="nowrap" gap="sm" className={styles.settingRow}>
                  <Switch
                    checked={isQuizPack}
                    onChange={(event) => setIsQuizPack(event.currentTarget.checked)}
                    withThumbIndicator={false}
                    classNames={{
                      track: styles.switchTrack,
                    }}
                  />
                  <Text className={styles.settingLabel}>Набор для викторины</Text>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Stack gap="sm" className={styles.footer} align="center">
          <Button className={styles.saveButton} onClick={handleSave}>
            Сохранить настройки
          </Button>
          <Text>Вы можете вернуться к этому шагу в любое время</Text>
        </Stack>
      </Stack>
    </PopupLayout>
  )
}
