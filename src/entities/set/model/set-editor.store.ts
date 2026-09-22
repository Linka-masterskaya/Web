import { createStore } from '@shared/lib/store'
import { changeSetPageType } from '../lib/change-set-page-type'
import { mergeEditorConfig } from '../lib/merge-editor-config'
import {
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
  resizeMatchingPage,
} from '../lib/set-page-structure'
import type { TSet } from './set.schema'
import type { TSetConfig, TSetPage, TSetPageElement, TSetPageType } from './set-config.schema'

type TEditorStore = {
  setId: string | null
  config: TSetConfig | null
  selectedCardId: string | null
  revision: number
  savedRevision: number
  isSaving: boolean
  saveError: boolean
  initialize: (set: TSet) => void
  selectCard: (id: string | null) => void
  changeType: (pageId: string, type: TSetPageType) => void
  resizeGrid: (pageId: string, rows: number, columns: number) => void
  resizeMatching: (pageId: string, pairCount: number) => void
  updateCard: (pageId: string, cardId: string, patch: Partial<TSetPageElement>) => void
}

export const useSetEditorStore = createStore<TEditorStore>('set-editor')((set) => {
  const updatePage = (
    pageId: string,
    update: (page: TSetPage) => TSetPage,
    settings?: TSetConfig['settings'],
  ) =>
    set((state) => {
      if (!state.config?.blocks.some((page) => page.id === pageId)) {
        return state
      }
      const blocks = state.config.blocks.map((page) => (page.id === pageId ? update(page) : page))
      return {
        selectedCardId: blocks.some((page) =>
          page.elements.some((card) => card.id === state.selectedCardId),
        )
          ? state.selectedCardId
          : null,
        config: {
          ...state.config,
          settings: settings ?? state.config.settings,
          blocks,
        },
        revision: state.revision + 1,
        saveError: false,
      }
    })
  return {
    setId: null,
    config: null,
    selectedCardId: null,
    revision: 0,
    savedRevision: 0,
    isSaving: false,
    saveError: false,
    initialize: (data) =>
      set((state) => {
        if (
          state.setId === data.id &&
          (state.isSaving || state.revision !== state.savedRevision || state.config === data.config)
        ) {
          return state
        }
        if (state.setId === data.id) {
          return { config: mergeEditorConfig(data.config, state.config) }
        }
        return {
          setId: data.id,
          config: data.config,
          selectedCardId: null,
          revision: 0,
          savedRevision: 0,
          saveError: false,
          isSaving: false,
        }
      }),
    selectCard: (selectedCardId) => set({ selectedCardId }),
    changeType: (pageId, type) => updatePage(pageId, (page) => changeSetPageType(page, type)),
    resizeGrid: (pageId, rows, columns) => {
      if (
        !Number.isInteger(rows) ||
        !Number.isInteger(columns) ||
        rows < 1 ||
        columns < 1 ||
        rows > 100 ||
        columns > 100
      ) {
        return
      }
      updatePage(pageId, (page) => {
        const elements = page.elements.slice(0, rows * columns)
        while (elements.length < rows * columns) {
          elements.push({ id: crypto.randomUUID(), kind: 'text', value: '' })
        }
        const ids = new Set(elements.map((card) => card.id))
        return {
          ...page,
          rows,
          columns,
          layout: { rows, columns },
          elements,
          ...(page.answers
            ? {
                answers: readSetPageAnswers(page).filter((item) => ids.has(item.element_id)),
              }
            : {}),
          ...(page.pairs
            ? {
                pairs: readSetPagePairs(page).filter(
                  (item) => ids.has(item.left_id) && ids.has(item.right_id),
                ),
              }
            : {}),
          ...(page.categories
            ? {
                categories: readSetPageCategories(page).map((category) => ({
                  ...category,
                  items: category.items.filter((id) => ids.has(id)),
                })),
              }
            : {}),
          ...(page.sequence
            ? {
                sequence: readSetPageSequence(page)
                  .filter((item) => ids.has(item.element_id))
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => ({ ...item, order: index + 1 })),
              }
            : {}),
        }
      })
    },
    resizeMatching: (pageId, pairCount) => {
      if (!Number.isInteger(pairCount) || pairCount < 1 || pairCount > 100) {
        return
      }

      updatePage(pageId, (page) => {
        if (page.type !== 'matching') {
          return page
        }

        return resizeMatchingPage(page, pairCount)
      })
    },
    updateCard: (pageId, cardId, patch) =>
      updatePage(pageId, (page) => ({
        ...page,
        elements: page.elements.map((card) =>
          card.id === cardId ? { ...card, ...patch, id: card.id } : card,
        ),
      })),
  }
})
