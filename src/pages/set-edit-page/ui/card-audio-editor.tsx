import { getMedia, type TMedia } from '@entities/media'
import { type TSetPageElement, useSetEditorStore } from '@entities/set'
import { generateTts, getTtsVoices, useTtsStore } from '@entities/tts'
import { Button, Select, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import styles from '../set-edit-page.module.scss'

export const CardAudioEditor: React.FC<{ pageId: string; card: TSetPageElement }> = ({
  pageId,
  card,
}) => {
  const setId = useSetEditorStore((state) => state.setId)
  const updateCard = useSetEditorStore((state) => state.updateCard)
  const preferredVoice = useTtsStore((state) => (setId ? state.voiceBySet[setId] : undefined))
  const setVoice = useTtsStore((state) => state.setVoice)
  const voices = useQuery({
    queryKey: ['tts', 'voices'],
    queryFn: getTtsVoices,
    staleTime: 300_000,
  })
  const options = (voices.data ?? []).map((voice) => ({ value: voice.id, label: voice.name }))
  const voice = options.some((option) => option.value === preferredVoice)
    ? preferredVoice
    : (options.find((option) => option.value === 'alena')?.value ?? options[0]?.value)
  const text = typeof card.speech_text === 'string' ? card.speech_text : ''
  const audioId = typeof card.audio_media_id === 'string' ? card.audio_media_id : undefined
  const audioMedia = useQuery({
    queryKey: ['media', audioId],
    queryFn: ({ signal }) => getMedia(audioId ?? '', signal),
    enabled: Boolean(audioId),
  })
  const audioUrl =
    audioMedia.data?.url ?? (typeof card.audio_url === 'string' ? card.audio_url : undefined)
  const hasAudio = Boolean(audioId || audioUrl)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [autoPlay, setAutoPlay] = useState(false)
  const operation = useRef<AbortController | null>(null)
  const player = useRef<HTMLAudioElement | null>(null)
  const update = (patch: Partial<TSetPageElement>) => updateCard(pageId, card.id, patch)

  useEffect(
    () => () => {
      operation.current?.abort()
      player.current?.pause()
    },
    [],
  )

  const applyAudio = (media: TMedia) => {
    update({ audio_media_id: media.id, audio_url: media.url, audio_name: media.name })
    setEditing(false)
  }
  const run = async (action: (signal: AbortSignal) => Promise<TMedia>, play = false) => {
    if (operation.current) {
      return
    }
    const controller = new AbortController()
    operation.current = controller
    setBusy(true)
    setError('')
    try {
      const media = await action(controller.signal)
      if (!controller.signal.aborted) {
        setAutoPlay(play)
        applyAudio(media)
      }
    } catch (reason) {
      if (!controller.signal.aborted) {
        setError(
          reason instanceof Error && reason.name === 'TimeoutError'
            ? 'Озвучка создаётся слишком долго. Попробуйте ещё раз.'
            : 'Не удалось подготовить озвучку. Попробуйте ещё раз.',
        )
      }
    } finally {
      if (!controller.signal.aborted) {
        setBusy(false)
      }
      if (operation.current === controller) {
        operation.current = null
      }
    }
  }

  return (
    <Stack gap="sm">
      <Text fw={600} ta="center">
        Озвучка
      </Text>
      {hasAudio && !editing ? (
        <>
          <Text size="xs" truncate>
            {audioMedia.data?.name ??
              (typeof card.audio_name === 'string' ? card.audio_name : 'Озвучка')}
          </Text>
          {audioMedia.isError && (
            <Text c="red" size="xs">
              Не удалось загрузить аудио.{' '}
              <Button variant="subtle" onClick={() => void audioMedia.refetch()}>
                Повторить
              </Button>
            </Text>
          )}
          <audio
            ref={player}
            key={audioUrl}
            controls
            autoPlay={autoPlay}
            src={audioUrl}
            className={styles.audioPlayer}
            onError={() =>
              setError('Не удалось воспроизвести запись. Попробуйте создать её заново.')
            }
          >
            <track kind="captions" />
          </audio>
          <div className={styles.inspectorActions}>
            <Button
              variant="outline"
              onClick={() => {
                player.current?.pause()
                setAutoPlay(false)
                setEditing(true)
                setError('')
              }}
            >
              Заменить
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                player.current?.pause()
                update({ audio_media_id: null, audio_url: undefined, audio_name: undefined })
                setError('')
              }}
            >
              Удалить
            </Button>
          </div>
        </>
      ) : (
        <>
          <TextInput
            aria-label="Текст озвучки"
            placeholder="Создать из текста"
            value={text}
            maxLength={5000}
            disabled={busy}
            onChange={(event) => update({ speech_text: event.currentTarget.value })}
          />
          <Select
            aria-label="Голос озвучки карточки"
            placeholder="Выберите голос"
            data={options}
            value={voice ?? null}
            disabled={busy || voices.isPending}
            onChange={(value) => {
              if (setId && value) {
                setVoice(setId, value)
              }
            }}
          />
          {voices.isError && (
            <Button variant="subtle" onClick={() => void voices.refetch()}>
              Повторить загрузку голосов
            </Button>
          )}
          <div className={styles.inspectorActions}>
            <Button
              variant="outline"
              disabled={busy || !text.trim() || !voice}
              onClick={() => {
                if (voice) {
                  void run((signal) => generateTts(text, voice, signal))
                }
              }}
            >
              + Добавить
            </Button>
            <Button
              variant="outline"
              loading={busy}
              disabled={!text.trim() || !voice}
              onClick={() => {
                if (voice) {
                  void run((signal) => generateTts(text, voice, signal), true)
                }
              }}
            >
              Слушать
            </Button>
          </div>
          {hasAudio && (
            <Button variant="subtle" disabled={busy} onClick={() => setEditing(false)}>
              Отменить замену
            </Button>
          )}
          {busy && (
            <Text size="xs" c="dimmed" role="status">
              Готовим озвучку…
            </Text>
          )}
        </>
      )}
      {error && (
        <Text c="red" size="xs" role="alert">
          {error}
        </Text>
      )}
    </Stack>
  )
}
