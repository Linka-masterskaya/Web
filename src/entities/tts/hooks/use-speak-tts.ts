import { useState } from 'react'
import { speakTts } from '../api/speak-tts'

export const useSpeakTts = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const speak = async (text: string, voice: string) => {
    setIsSpeaking(true)
    setError(null)

    try {
      await speakTts({
        text,
        voice,
      })
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Не удалось воспроизвести озвучку'))
    } finally {
      setIsSpeaking(false)
    }
  }

  return {
    speak,
    isSpeaking,
    error,
  }
}
