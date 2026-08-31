import type { TSetSettings } from './model/set-settings.schema'

// Возраст
export const SET_AGE_MIN = 3
export const SET_AGE_MAX = 18

// Вычисление правильного склонения (лет/год)
const getAgeLabel = (age: number) => {
  if (age % 10 === 1 && age !== 11) {
    return `${age} год`
  }

  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age)) {
    return `${age} года`
  }

  return `${age} лет`
}

export const SET_AGE_OPTIONS = Array.from({ length: SET_AGE_MAX - SET_AGE_MIN + 1 }, (_, i) => {
  const age = SET_AGE_MIN + i

  return {
    value: String(age),
    label: getAgeLabel(age),
  }
}) satisfies { value: string; label: string }[]

// Уровень сложности
export const SET_LEVEL_VALUES = ['easy', 'medium', 'hard'] as const

export type TSetLevel = (typeof SET_LEVEL_VALUES)[number]

export const SET_LEVEL_OPTIONS = [
  {
    value: 'easy',
    label: 'Лёгкий',
  },
  {
    value: 'medium',
    label: 'Средний',
  },
  {
    value: 'hard',
    label: 'Сложный',
  },
] satisfies { value: TSetLevel; label: string }[]

// Голос озвучки
export const SET_VOICE_VALUES = ['alena', 'ivan'] as const

export type TSetVoice = (typeof SET_VOICE_VALUES)[number]

export const SET_VOICE_OPTIONS = [
  {
    value: 'alena',
    label: 'Алена (ru-RU)',
  },
  {
    value: 'ivan',
    label: 'Иван (ru-RU)',
  },
] satisfies { value: TSetVoice; label: string }[]

// Дефолтные значения параметров набора
export const SET_SETTINGS_DEFAULT_VALUES: TSetSettings = {
  title: '',
  age: '5',
  level: 'easy',
  voice: 'alena',
  notes: '',
  isTypingPack: false,
  isAutoSpeak: false,
  isQuizPack: false,
}
