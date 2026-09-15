import { getMedia } from '@entities/media'
import { createTts } from './create-tts'
import { getTtsJob } from './get-tts-job'

const waitForPoll = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    signal.throwIfAborted()
    const onAbort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, 1000)
    signal.addEventListener('abort', onAbort, { once: true })
  })

/** Возвращает готовый файл для карточки; не запускает воспроизведение в фоне. */
export const generateTts = async (text: string, voice: string, cancellation?: AbortSignal) => {
  if (!text.trim() || text.length > 5000 || !voice) {
    throw new Error('Введите текст и выберите голос')
  }
  const timeout = AbortSignal.timeout(120_000)
  const signal = cancellation ? AbortSignal.any([cancellation, timeout]) : timeout
  const { job_id } = await createTts({ text: text.trim(), voice }, signal)
  while (true) {
    signal.throwIfAborted()
    const job = await getTtsJob(job_id, signal)
    if (job.status === 'failed') {
      throw new Error('Не удалось создать озвучку. Попробуйте ещё раз.')
    }
    if (job.status === 'succeeded') {
      if (!job.media_id) {
        throw new Error('Сервис озвучки не вернул аудиофайл')
      }
      return getMedia(job.media_id, signal)
    }
    await waitForPoll(signal)
  }
}
