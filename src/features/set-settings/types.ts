import type { TSetLevel, TSetVoice } from './config'

export type TSetSettings = {
  age: string
  level: TSetLevel
  voice: TSetVoice
  notes: string
  isTypingPack: boolean
  isAutoSpeak: boolean
  isQuizPack: boolean
}

export type TSetSettingsProps = {
  onClose?: () => void
  onSave?: (values: TSetSettings) => void
}
