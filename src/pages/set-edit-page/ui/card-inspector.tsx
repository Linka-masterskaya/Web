import { type TSetPageElement, useSetEditorStore } from '@entities/set'
import { Button, Stack, Text, TextInput } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { LibrarySettings } from '@widgets/library-settings'
import styles from '../set-edit-page.module.scss'
import { CardAudioEditor } from './card-audio-editor'
import { GridCardImage } from './grid-card-image'

const cardTypes = [
  { value: 'normal', label: 'Обычная' },
  { value: 'empty', label: 'Пустая' },
  { value: 'text', label: 'Текст' },
  { value: 'space', label: 'Пробел' },
] as const

export const CardInspector: React.FC<{ pageId: string; card: TSetPageElement }> = ({
  pageId,
  card,
}) => {
  const { open } = useModal()
  const updateCard = useSetEditorStore((state) => state.updateCard)
  const update = (patch: Partial<TSetPageElement>) => updateCard(pageId, card.id, patch)
  const hasImage = Boolean(
    card.source_picture_id || (card.kind === 'image' && (card.media_url || card.media_id)),
  )

  const chooseImage = () =>
    open({
      content: (
        <LibrarySettings
          onSelect={(cards, imports) => {
            const picture = cards[0]
            const imported = imports[0]
            if (!picture || !imported) {
              return
            }
            update({
              kind: 'image',
              card_type: 'normal',
              source_picture_id: imported.sourcePictureId,
              media_id: null,
              media_url: imported.contentUrl,
              value: card.value || picture.title,
            })
          }}
        />
      ),
      size: 'auto',
      padding: 0,
      radius: 12,
      withCloseButton: false,
    })

  return (
    <Stack gap="xl" className={styles.cardInspector}>
      <Text size="xs" c="dimmed">
        Текст озвучки сохраняется после создания записи. Скрытое содержимое пустой карточки и
        пробела остаётся только в текущем сеансе.
      </Text>
      <div className={styles.cardTypeOptions}>
        {cardTypes.map((type) => (
          <Button
            key={type.value}
            variant={(card.card_type ?? 'normal') === type.value ? 'light' : 'outline'}
            aria-pressed={(card.card_type ?? 'normal') === type.value}
            onClick={() => update({ card_type: type.value })}
          >
            {type.label}
          </Button>
        ))}
      </div>
      {card.card_type !== 'empty' && card.card_type !== 'space' && (
        <TextInput
          aria-label="Название карточки"
          placeholder="Введите название"
          value={card.value ?? ''}
          onChange={(event) => update({ value: event.currentTarget.value })}
        />
      )}
      <Stack gap="sm">
        <Text fw={600} ta="center">
          Изображение
        </Text>
        {hasImage && (
          <div className={styles.imagePreview}>
            <GridCardImage card={card} />
          </div>
        )}
        <div className={styles.inspectorActions}>
          <Button variant="outline" onClick={chooseImage}>
            {hasImage ? 'Заменить' : 'Выбрать'}
          </Button>
          {hasImage && (
            <Button
              variant="outline"
              onClick={() =>
                update({
                  kind: 'text',
                  source_picture_id: null,
                  media_id: null,
                  media_url: undefined,
                })
              }
            >
              Удалить
            </Button>
          )}
        </div>
      </Stack>
      <CardAudioEditor key={card.id} pageId={pageId} card={card} />
    </Stack>
  )
}
