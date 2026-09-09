import type { TSetPage, TSetPageElement } from '../model/set-config.schema'

type TPageAnswer = { element_id: string; is_correct: boolean }
type TPagePair = { left_id: string; right_id: string }
type TPageCategory = { id: string; name: string; items: string[] }

export type TSetPageStructure = {
  primaryLabel: string
  primaryCount: number
  primaryMin: number
  primaryMax: number
  secondaryLabel?: string
  secondaryCount?: number
  secondaryMin?: number
  secondaryMax?: number
}

const createTextElement = (): TSetPageElement => ({
  id: crypto.randomUUID(),
  kind: 'text',
  value: '',
})

const resizeElements = (elements: TSetPageElement[], count: number) => {
  const nextElements = elements.slice(0, count)

  while (nextElements.length < count) {
    nextElements.push(createTextElement())
  }

  return nextElements
}

const readAnswers = (page: TSetPage): TPageAnswer[] =>
  Array.isArray(page.answers)
    ? page.answers.filter(
        (answer): answer is TPageAnswer =>
          typeof answer === 'object' &&
          answer !== null &&
          typeof answer.element_id === 'string' &&
          typeof answer.is_correct === 'boolean',
      )
    : []

const readPairs = (page: TSetPage): TPagePair[] =>
  Array.isArray(page.pairs)
    ? page.pairs.filter(
        (pair): pair is TPagePair =>
          typeof pair === 'object' &&
          pair !== null &&
          typeof pair.left_id === 'string' &&
          typeof pair.right_id === 'string',
      )
    : []

const readCategories = (page: TSetPage): TPageCategory[] =>
  Array.isArray(page.categories)
    ? page.categories.filter(
        (category): category is TPageCategory =>
          typeof category === 'object' &&
          category !== null &&
          typeof category.id === 'string' &&
          typeof category.name === 'string' &&
          Array.isArray(category.items) &&
          category.items.every((item: unknown) => typeof item === 'string'),
      )
    : []

export const getSetPageStructure = (page: TSetPage): TSetPageStructure => {
  switch (page.type) {
    case 'matching':
      return {
        primaryLabel: 'Количество пар',
        primaryCount: Math.max(1, readPairs(page).length || Math.ceil(page.elements.length / 2)),
        primaryMin: 1,
        primaryMax: 12,
      }

    case 'sequence':
      return {
        primaryLabel: 'Количество карточек',
        primaryCount: page.elements.length,
        primaryMin: 2,
        primaryMax: 24,
      }

    case 'categories': {
      const categories = readCategories(page)
      const categoryCount = Math.max(1, categories.length)
      const itemCount = Math.max(
        1,
        categories[0]?.items.length ?? Math.ceil(page.elements.length / categoryCount),
      )

      return {
        primaryLabel: 'Количество категорий',
        primaryCount: categoryCount,
        primaryMin: 1,
        primaryMax: 8,
        secondaryLabel: 'Кол-во вариантов ответов',
        secondaryCount: itemCount,
        secondaryMin: 1,
        secondaryMax: 12,
      }
    }

    default:
      return {
        primaryLabel: 'Количество вариантов',
        primaryCount: page.elements.length,
        primaryMin: page.type === 'grid' ? 1 : 2,
        primaryMax: 24,
      }
  }
}

const resizeChoicePage = (page: TSetPage, count: number): TSetPage => {
  const elements = resizeElements(page.elements, count)
  const answerByElementId = new Map(
    readAnswers(page).map((answer) => [answer.element_id, answer.is_correct]),
  )
  const answers = elements.map((element, index) => ({
    element_id: element.id,
    is_correct: answerByElementId.get(element.id) ?? index === 0,
  }))

  if (!answers.some((answer) => answer.is_correct)) {
    answers[0].is_correct = true
  }

  if (page.type === 'single_choice') {
    let hasCorrectAnswer = false

    for (const answer of answers) {
      answer.is_correct = answer.is_correct && !hasCorrectAnswer
      hasCorrectAnswer ||= answer.is_correct
    }
  }

  return { ...page, elements, answers }
}

const resizeMatchingPage = (page: TSetPage, pairCount: number): TSetPage => {
  const elementById = new Map(page.elements.map((element) => [element.id, element]))
  const currentPairs = readPairs(page)
  const elements: TSetPageElement[] = []
  const pairs: TPagePair[] = []

  for (let index = 0; index < pairCount; index += 1) {
    const currentPair = currentPairs[index]
    const left = (currentPair && elementById.get(currentPair.left_id)) ?? createTextElement()
    const right = (currentPair && elementById.get(currentPair.right_id)) ?? createTextElement()

    elements.push(left, right)
    pairs.push({ left_id: left.id, right_id: right.id })
  }

  return { ...page, elements, pairs }
}

const resizeCategoriesPage = (
  page: TSetPage,
  categoryCount: number,
  itemCount: number,
): TSetPage => {
  const elementById = new Map(page.elements.map((element) => [element.id, element]))
  const currentCategories = readCategories(page)
  const elements: TSetPageElement[] = []
  const categories: TPageCategory[] = []

  for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex += 1) {
    const currentCategory = currentCategories[categoryIndex]
    const categoryElements = resizeElements(
      (currentCategory?.items ?? []).flatMap((id) => {
        const element = elementById.get(id)
        return element ? [element] : []
      }),
      itemCount,
    )

    elements.push(...categoryElements)
    categories.push({
      id: currentCategory?.id ?? crypto.randomUUID(),
      name: currentCategory?.name ?? '',
      items: categoryElements.map((element) => element.id),
    })
  }

  return { ...page, elements, categories }
}

export const resizeSetPageStructure = (
  page: TSetPage,
  primaryCount: number,
  secondaryCount?: number,
): TSetPage => {
  switch (page.type) {
    case 'single_choice':
    case 'multi_choice':
      return resizeChoicePage(page, primaryCount)

    case 'matching':
      return resizeMatchingPage(page, primaryCount)

    case 'categories':
      return resizeCategoriesPage(page, primaryCount, secondaryCount ?? 1)

    case 'sequence': {
      const elements = resizeElements(page.elements, primaryCount)

      return {
        ...page,
        elements,
        sequence: elements.map((element, index) => ({
          element_id: element.id,
          order: index + 1,
        })),
      }
    }

    case 'grid':
      return { ...page, elements: resizeElements(page.elements, primaryCount) }
  }
}
