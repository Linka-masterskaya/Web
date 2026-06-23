export type TViewMode = 'list' | 'grid'

export type TViewModeOption = {
  id: TViewMode
  icon: 'List' | 'LayoutGrid'
  label: string
  onSelect?: () => void
}

export const VIEW_QUERY_PARAM_KEY = 'view'

export const VIEW_MODE_OPTIONS: TViewModeOption[] = [
  { id: 'list', icon: 'List', label: 'Список' },
  { id: 'grid', icon: 'LayoutGrid', label: 'Сетка' },
]
