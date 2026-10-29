import type { TSetPage } from '@entities/set'
import { createStore } from '@shared/lib/store'

export type TSetPagesClipboard = {
  mode: 'copy' | 'cut'
  sourceSetId: string
  page: TSetPage
}

type TSetPagesClipboardState = {
  clipboard: TSetPagesClipboard | null
}

type TSetPagesClipboardActions = {
  copy: (sourceSetId: string, page: TSetPage) => void
  cut: (sourceSetId: string, page: TSetPage) => void
  clear: () => void
}

/**
 * Буфер обмена страницами набора. Живёт в памяти сессии, поэтому страницу
 * можно скопировать или вырезать в одном наборе и вставить в другом.
 */
export const useSetPagesClipboardStore = createStore<
  TSetPagesClipboardState & TSetPagesClipboardActions
>('SetPagesClipboardStore')((set) => ({
  clipboard: null,

  copy: (sourceSetId, page) => set({ clipboard: { mode: 'copy', sourceSetId, page } }),

  cut: (sourceSetId, page) => set({ clipboard: { mode: 'cut', sourceSetId, page } }),

  clear: () => set({ clipboard: null }),
}))
