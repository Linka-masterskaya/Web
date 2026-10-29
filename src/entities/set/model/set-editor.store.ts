import { createStore } from '@shared/lib/store'
import { changeSetPageType } from '../lib/change-set-page-type'
import { createEmptySetPage } from '../lib/create-empty-set-page'
import { mergeEditorConfig } from '../lib/merge-editor-config'
import {
  getSetPageStructure,
  moveSequenceCard,
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
  resizeMatchingPage,
  resizeSetPageStructure,
  toggleSetPageAnswer,
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
  addPage: (type?: TSetPageType) => string | null
  selectCard: (id: string | null) => void
  changeType: (pageId: string, type: TSetPageType) => void
  resizeGrid: (pageId: string, rows: number, columns: number) => void
  resizeStructure: (pageId: string, primaryCount: number, secondaryCount?: number) => void
  resizeMatching: (pageId: string, pairCount: number) => void
  resizeOptions: (pageId: string, count: number) => void
  toggleAnswer: (pageId: string, cardId: string) => void
  moveSequence: (pageId: string, cardId: string, direction: -1 | 1) => void
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
      if (blocks.every((page, index) => page === state.config?.blocks[index])) {
        return state
      }
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
    addPage: (type = 'grid') => {
      let pageId: string | null = null
      set((state) => {
        if (!state.config) {
          return state
        }
        const page = createEmptySetPage(type)
        pageId = page.id
        return {
          selectedCardId: null,
          config: {
            ...state.config,
            blocks: [...state.config.blocks, page],
          },
          revision: state.revision + 1,
          saveError: false,
        }
      })
      return pageId
    },
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
          elements.push({ id: crypto.randomUUID(), kind: 'text', card_type: 'normal', value: '' })
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
    resizeStructure: (pageId, primaryCount, secondaryCount) => {
      if (!Number.isInteger(primaryCount) || primaryCount < 1) {
        return
      }
      if (secondaryCount != null && (!Number.isInteger(secondaryCount) || secondaryCount < 1)) {
        return
      }
      updatePage(pageId, (page) => resizeSetPageStructure(page, primaryCount, secondaryCount))
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
    resizeOptions: (pageId, count) =>
      updatePage(pageId, (page) => {
        const limits = getSetPageStructure(page)
        if (
          !['single_choice', 'multi_choice', 'sequence'].includes(page.type) ||
          !Number.isInteger(count) ||
          count < limits.primaryMin ||
          count > limits.primaryMax
        ) {
          return page
        }
        return resizeSetPageStructure(page, count)
      }),
    toggleAnswer: (pageId, cardId) =>
      updatePage(pageId, (page) => toggleSetPageAnswer(page, cardId)),
    moveSequence: (pageId, cardId, direction) =>
      updatePage(pageId, (page) => moveSequenceCard(page, cardId, direction)),
    updateCard: (pageId, cardId, patch) =>
      updatePage(pageId, (page) => ({
        ...page,
        elements: page.elements.map((card) =>
          card.id === cardId ? { ...card, ...patch, id: card.id } : card,
        ),
      })),
  }
})
