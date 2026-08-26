export const STUDENT_AGE_MIN = 3
export const STUDENT_AGE_MAX = 18

// Статусы ученика — соответствуют полю status в API
export const STUDENT_STATUS_OPTIONS = ['active', 'paused', 'one_time', 'archived'] as const
export type TStudentStatus = (typeof STUDENT_STATUS_OPTIONS)[number]

export const STUDENT_STATUS_LABELS: Record<TStudentStatus, string> = {
  active: 'Активный',
  paused: 'На паузе',
  one_time: 'Разовый',
  archived: 'Архивный',
}

export const STUDENT_CARDS_SHIFT_OPTIONS = ['left', 'full', 'right'] as const
export type TStudentCardsShift = (typeof STUDENT_CARDS_SHIFT_OPTIONS)[number]

export const STUDENT_CARDS_SHIFT_LABELS: Record<TStudentCardsShift, string> = {
  left: 'Слева',
  full: 'На весь экран',
  right: 'Справа',
}

export const STUDENT_LEVEL_OPTIONS = ['easy', 'medium', 'hard'] as const
export type TStudentLevel = (typeof STUDENT_LEVEL_OPTIONS)[number]

export const STUDENT_LEVEL_LABELS: Record<TStudentLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

// Sort

export const STUDENT_SORT_FIELDS = ['name', 'email', 'age', 'status'] as const
export type TStudentSortField = (typeof STUDENT_SORT_FIELDS)[number]

export const STUDENT_DEFAULT_SORT_FIELD: TStudentSortField = 'name'
export const STUDENT_DEFAULT_SORT_ORDER: 'asc' | 'desc' = 'asc'
