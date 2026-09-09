import { useLoadTtsVoices } from '../hooks/use-load-tts-voices'

export const TtsInitializer = () => {
  // Загружаем доступные голоса при запуске приложения
  useLoadTtsVoices()

  return null
}
