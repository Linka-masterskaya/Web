import { useSendSet, useSet } from '@entities/set'
import { useStudents } from '@entities/student'
import { ActionIcon, Button, Loader, Text, TextInput, Title } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import { type FormEvent, useMemo, useState } from 'react'
import styles from './send-set.module.scss'
import { SendSetSuccessNotification } from './send-set-success-notification'
import type { TSendSetProps } from './types'

export const SendSet: React.FC<TSendSetProps> = ({ setId, className, onClose, onSuccess }) => {
  const { open } = useModal()
  const setQuery = useSet(setId)
  const studentsQuery = useStudents()
  const sendSetMutation = useSendSet()
  const [search, setSearch] = useState('')
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null)

  const normalizedSearch = search.trim().toLocaleLowerCase('ru')
  const recipients = useMemo(
    () =>
      (studentsQuery.data ?? []).filter((recipient) =>
        recipient.name.toLocaleLowerCase('ru').includes(normalizedSearch),
      ),
    [normalizedSearch, studentsQuery.data],
  )
  const selectedRecipient = studentsQuery.data?.find(
    (recipient) => recipient.id === selectedRecipientId,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedRecipient) {
      return
    }

    sendSetMutation.mutate(
      {
        setId: setQuery.data?.id ?? setId,
        email: selectedRecipient.email,
      },
      {
        onSuccess: () => {
          onSuccess?.()
          open({
            content: <SendSetSuccessNotification />,
            size: 397,
            padding: 0,
            radius: 20,
            withCloseButton: false,
          })
        },
      },
    )
  }

  const handleRecipientClick = (recipientId: string) => {
    setSelectedRecipientId((currentId) => (currentId === recipientId ? null : recipientId))
    sendSetMutation.reset()
  }

  const renderState = (content: React.ReactNode) => <div className={styles.state}>{content}</div>
  const isLoading = setQuery.isLoading || studentsQuery.isLoading
  const isError = setQuery.isError || studentsQuery.isError
  const handleRetry = () => Promise.all([setQuery.refetch(), studentsQuery.refetch()])

  return (
    <section className={clsx(styles.container, className)} aria-labelledby="send-set-title">
      {onClose && (
        <ActionIcon
          className={styles.closeButton}
          variant="subtle"
          size={24}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <Icon name="X" size={24} />
        </ActionIcon>
      )}

      <Title id="send-set-title" className={styles.title} order={2}>
        Поделиться набором
      </Title>

      {isLoading && renderState(<Loader aria-label="Загрузка набора" />)}

      {isError &&
        renderState(
          <>
            <Text role="alert">Не удалось загрузить данные</Text>
            <Button variant="outline" onClick={handleRetry}>
              Повторить
            </Button>
          </>,
        )}

      {!isLoading && !isError && !setQuery.data && renderState(<Text>Набор не найден</Text>)}

      {!isLoading && !isError && setQuery.data && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            aria-label="Поиск ученика"
            placeholder="Поиск"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value)
              setSelectedRecipientId(null)
              sendSetMutation.reset()
            }}
            leftSection={<Icon name="Search" size={20} />}
            classNames={{ input: styles.searchInput }}
          />

          <div className={styles.recipients}>
            {recipients.length > 0 ? (
              recipients.map((recipient) => {
                const isSelected = recipient.id === selectedRecipientId

                return (
                  <button
                    className={styles.recipient}
                    type="button"
                    key={recipient.id}
                    aria-pressed={isSelected}
                    onClick={() => handleRecipientClick(recipient.id)}
                  >
                    <span className={styles.recipientName}>{recipient.name}</span>
                    {isSelected && <span className={styles.recipientEmail}>{recipient.email}</span>}
                  </button>
                )
              })
            ) : (
              <Text className={styles.emptyRecipients}>Ничего не найдено</Text>
            )}
          </div>

          {sendSetMutation.isError && (
            <Text className={styles.errorText} role="alert">
              Не удалось отправить набор. Попробуйте ещё раз.
            </Text>
          )}

          <Button
            className={styles.submitButton}
            type="submit"
            disabled={!selectedRecipient}
            loading={sendSetMutation.isPending}
          >
            Отправить
          </Button>
        </form>
      )}
    </section>
  )
}
