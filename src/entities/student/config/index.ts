export const STUDENT_AGE_MIN = 3
export const STUDENT_AGE_MAX = 18

export const STUDENT_STATE_OPTIONS = ['active', 'paused', 'single', 'archived'] as const
export type TStudentState = (typeof STUDENT_STATE_OPTIONS)[number]

export const STUDENT_STATE_LABELS: Record<TStudentState, string> = {
  active: 'Активный',
  paused: 'На паузе',
  single: 'Разовый',
  archived: 'Архивный',
}

export const STUDENT_LEVEL_OPTIONS = ['easy', 'medium', 'hard'] as const
export type TStudentLevel = (typeof STUDENT_LEVEL_OPTIONS)[number]

export const STUDENT_LEVEL_LABELS: Record<TStudentLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

export const STUDENT_CARDS_SHIFT_OPTIONS = ['left', 'full', 'right'] as const
export type TStudentCardsShift = (typeof STUDENT_CARDS_SHIFT_OPTIONS)[number]

export const STUDENT_CARDS_SHIFT_LABELS: Record<TStudentCardsShift, string> = {
  left: 'Слева',
  full: 'На весь экран',
  right: 'Справа',
}
