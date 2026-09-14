import { useEffect } from 'react'
import { getTtsVoices } from '../api/get-tts-voices'
import { useTtsStore } from '../model/tts-store'

export const useLoadTtsVoices = () => {
  const setVoices = useTtsStore((state) => state.setVoices)

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await getTtsVoices()
        setVoices(voices)
      } catch {
        // При ошибке список остается пустым, чтобы не блокировать работу приложения
      }
    }

    void loadVoices()
  }, [setVoices])
}
