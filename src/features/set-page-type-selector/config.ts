import type { TSetPageType } from '@entities/set'
import type { IIconProps } from '@shared/ui/icon'

type TSetPageTypeIcon = Extract<
  IIconProps['name'],
  'Grid3x3' | 'ArrowDown01' | 'ListCheck' | 'ListChecks' | 'GitCompareArrows' | 'Combine'
>

export const SET_PAGE_TYPE_LABELS: Record<TSetPageType, string> = {
  grid: 'Сетка',
  single_choice: 'Один ответ',
  multi_choice: 'Несколько ответов',
  matching: 'Сопоставление',
  categories: 'Категории',
  sequence: 'Последовательность',
}

export const SET_PAGE_TYPE_ICONS: Record<TSetPageType, TSetPageTypeIcon> = {
  grid: 'Grid3x3',
  sequence: 'ArrowDown01',
  single_choice: 'ListCheck',
  multi_choice: 'ListChecks',
  matching: 'GitCompareArrows',
  categories: 'Combine',
}

export const SET_PAGE_TYPE_OPTIONS = [
  { id: 'grid', iconName: SET_PAGE_TYPE_ICONS.grid, title: SET_PAGE_TYPE_LABELS.grid },
  { id: 'sequence', iconName: SET_PAGE_TYPE_ICONS.sequence, title: SET_PAGE_TYPE_LABELS.sequence },
  {
    id: 'single_choice',
    iconName: SET_PAGE_TYPE_ICONS.single_choice,
    title: SET_PAGE_TYPE_LABELS.single_choice,
  },
  {
    id: 'multi_choice',
    iconName: SET_PAGE_TYPE_ICONS.multi_choice,
    title: SET_PAGE_TYPE_LABELS.multi_choice,
  },
  { id: 'matching', iconName: SET_PAGE_TYPE_ICONS.matching, title: SET_PAGE_TYPE_LABELS.matching },
  {
    id: 'categories',
    iconName: SET_PAGE_TYPE_ICONS.categories,
    title: SET_PAGE_TYPE_LABELS.categories,
  },
] as const
