import type { TSetConfig } from '../model/set-config.schema'

/** Сохраняем только черновики и кеш медиа; сохранённые поля берём с сервера. */
export const mergeEditorConfig = (remote: TSetConfig, local: TSetConfig | null): TSetConfig => {
  if (!local) {
    return remote
  }
  const pages = new Map(local.blocks.map((page) => [page.id, page]))
  return {
    ...remote,
    blocks: remote.blocks.map((page) => {
      const previous = pages.get(page.id)
      if (!previous) {
        return page
      }
      const cards = new Map(previous.elements.map((card) => [card.id, card]))
      return {
        ...page,
        layout: page.layout ?? previous.layout,
        rows: previous.rows,
        columns: previous.columns,
        elements: page.elements.map((card) => {
          const previousCard = cards.get(card.id)
          if (!previousCard) {
            return card
          }
          const hidden = card.card_type === 'empty' || card.card_type === 'space'
          const sameAudio = card.audio_media_id === previousCard.audio_media_id
          return {
            ...card,
            ...(hidden
              ? {
                  kind: previousCard.kind,
                  value: previousCard.value,
                  media_id: previousCard.media_id,
                  media_url: previousCard.media_url,
                  source_picture_id: previousCard.source_picture_id,
                  audio_media_id: previousCard.audio_media_id,
                  speech_text: previousCard.speech_text,
                }
              : {}),
            ...(!card.audio_media_id ? { speech_text: previousCard.speech_text } : {}),
            ...(sameAudio || hidden
              ? {
                  audio_url: previousCard.audio_url,
                  audio_name: previousCard.audio_name,
                }
              : {}),
          }
        }),
      }
    }),
  }
}
