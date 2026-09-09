import { getMedia } from '@entities/media'
import { createTts } from './create-tts'
import { getTtsJob } from './get-tts-job'

type TSpeakTtsParams = {
  text: string
  voice: string
}

export const speakTts = async ({ text, voice }: TSpeakTtsParams): Promise<void> => {
  // Запускаем асинхронную генерацию и получаем идентификатор задачи
  const { job_id } = await createTts({
    text,
    voice,
  })

  // Ждем завершения генерации, периодически проверяя статус задачи
  let job = await getTtsJob(job_id)

  while (job.status === 'pending' || job.status === 'in_progress') {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    job = await getTtsJob(job_id)
  }

  if (job.status === 'failed') {
    throw new Error('Не удалось сгенерировать озвучку')
  }

  if (!job.media_id) {
    throw new Error('В ответе TTS отсутствует media_id')
  }

  // После успешной генерации получаем временную ссылку на готовый аудиофайл
  const media = await getMedia(job.media_id)

  const audio = new Audio(media.url)

  await audio.play()
}
