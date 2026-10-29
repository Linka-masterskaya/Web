import { generateTts } from './generate-tts'

type TSpeakTtsParams = {
  text: string
  voice: string
}

export const speakTts = async ({ text, voice }: TSpeakTtsParams): Promise<void> => {
  const media = await generateTts(text, voice)
  const audio = new Audio(media.url)
  await audio.play()
}
