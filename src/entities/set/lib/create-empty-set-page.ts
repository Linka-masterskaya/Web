import type { TSetPage, TSetPageType } from '../model/set-config.schema'

const createTextElement = () => ({
  id: crypto.randomUUID(),
  kind: 'text' as const,
  value: '',
})

/** Минимально валидный block для каждого типа страницы Linka Config 2.0. */
export const createEmptySetPage = (type: TSetPageType, pageId: string = crypto.randomUUID()): TSetPage => {
  const blockId = pageId

  switch (type) {
    case 'grid':
      return {
        id: blockId,
        type,
        elements: [createTextElement()],
      }

    case 'single_choice': {
      const first = createTextElement()
      const second = createTextElement()

      return {
        id: blockId,
        type,
        elements: [first, second],
        answers: [
          { element_id: first.id, is_correct: true },
          { element_id: second.id, is_correct: false },
        ],
      }
    }

    case 'multi_choice': {
      const first = createTextElement()
      const second = createTextElement()

      return {
        id: blockId,
        type,
        elements: [first, second],
        answers: [
          { element_id: first.id, is_correct: true },
          { element_id: second.id, is_correct: false },
        ],
      }
    }

    case 'matching': {
      const left = createTextElement()
      const right = createTextElement()

      return {
        id: blockId,
        type,
        elements: [left, right],
        pairs: [{ left_id: left.id, right_id: right.id }],
      }
    }

    case 'categories': {
      const first = createTextElement()
      const second = createTextElement()

      return {
        id: blockId,
        type,
        elements: [first, second],
        categories: [
          {
            id: crypto.randomUUID(),
            name: '',
            items: [first.id, second.id],
          },
        ],
      }
    }

    case 'sequence': {
      const first = createTextElement()
      const second = createTextElement()

      return {
        id: blockId,
        type,
        elements: [first, second],
        sequence: [
          { element_id: first.id, order: 1 },
          { element_id: second.id, order: 2 },
        ],
      }
    }
  }
}
