export type TFilterLevel = 'easy' | 'medium' | 'hard'

export const FILTER_LEVEL_OPTIONS: TFilterLevel[] = ['easy', 'medium', 'hard']

export const FILTER_LEVEL_LABELS: Record<TFilterLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}
