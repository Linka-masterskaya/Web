import type { TSetPage, TSetPageType } from '../model/set-config.schema'

const createTextElement = () => ({
  id: crypto.randomUUID(),
  kind: 'text' as const,
  value: '',
})

const createTextElements = (count: number) =>
  Array.from({ length: count }, () => createTextElement())

/** Минимально валидный block для каждого типа страницы Linka Config 2.0. */
export const createEmptySetPage = (
  type: TSetPageType,
  pageId: string = crypto.randomUUID(),
): TSetPage => {
  const blockId = pageId

  switch (type) {
    case 'grid':
      return {
        id: blockId,
        type,
        elements: createTextElements(12),
      }

    case 'single_choice': {
      const elements = createTextElements(3)

      return {
        id: blockId,
        type,
        elements,
        answers: elements.map((element, index) => ({
          element_id: element.id,
          is_correct: index === 0,
        })),
      }
    }

    case 'multi_choice': {
      const elements = createTextElements(4)

      return {
        id: blockId,
        type,
        elements,
        answers: elements.map((element, index) => ({
          element_id: element.id,
          is_correct: index === 0,
        })),
      }
    }

    case 'matching': {
      const elements = createTextElements(4)

      return {
        id: blockId,
        type,
        elements,
        pairs: [
          { left_id: elements[0].id, right_id: elements[1].id },
          { left_id: elements[2].id, right_id: elements[3].id },
        ],
      }
    }

    case 'categories': {
      const elements = createTextElements(6)

      return {
        id: blockId,
        type,
        elements,
        categories: [
          {
            id: crypto.randomUUID(),
            name: '',
            items: elements.slice(0, 3).map((element) => element.id),
          },
          {
            id: crypto.randomUUID(),
            name: '',
            items: elements.slice(3).map((element) => element.id),
          },
        ],
      }
    }

    case 'sequence': {
      const elements = createTextElements(4)

      return {
        id: blockId,
        type,
        elements,
        sequence: elements.map((element, index) => ({
          element_id: element.id,
          order: index + 1,
        })),
      }
    }
  }
}
