import type { TSetPageType } from '../model/set-config.schema'

export const SET_PAGE_TYPE_LABELS: Record<TSetPageType, string> = {
  grid: 'Сетка',
  single_choice: 'Один ответ',
  multi_choice: 'Несколько ответов',
  matching: 'Сопоставление',
  categories: 'Категории',
  sequence: 'Последовательность',
}

export const SET_PAGE_TYPE_OPTIONS = [
  { id: 'grid', iconName: 'Grid3x3', title: SET_PAGE_TYPE_LABELS.grid },
  { id: 'sequence', iconName: 'ArrowDown01', title: SET_PAGE_TYPE_LABELS.sequence },
  { id: 'single_choice', iconName: 'ListCheck', title: SET_PAGE_TYPE_LABELS.single_choice },
  { id: 'multi_choice', iconName: 'ListChecks', title: SET_PAGE_TYPE_LABELS.multi_choice },
  { id: 'matching', iconName: 'GitCompareArrows', title: SET_PAGE_TYPE_LABELS.matching },
  { id: 'categories', iconName: 'Combine', title: SET_PAGE_TYPE_LABELS.categories },
] as const
