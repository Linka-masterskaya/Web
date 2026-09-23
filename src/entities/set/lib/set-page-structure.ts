import type { TSetPage, TSetPageElement } from '../model/set-config.schema'

export type TPageAnswer = { element_id: string; is_correct: boolean }
export type TPagePair = { left_id: string; right_id: string }
export type TPageCategory = {
  id: string
  element_id?: string
  name?: string
  items: string[]
}
export type TPageSequenceItem = { element_id: string; order: number }

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
  card_type: 'text',
  value: '',
})

const resizeElements = (elements: TSetPageElement[], count: number) => {
  const nextElements = elements.slice(0, count)

  while (nextElements.length < count) {
    nextElements.push(createTextElement())
  }

  return nextElements
}

/**
 * Читает варианты ответа страницы. Схема пропускает поля через passthrough,
 * поэтому тип недоступен статически и массив проверяется вручную.
 */
export const readSetPageAnswers = (page: TSetPage): TPageAnswer[] =>
  Array.isArray(page.answers)
    ? page.answers.filter(
        (answer): answer is TPageAnswer =>
          typeof answer === 'object' &&
          answer !== null &&
          typeof answer.element_id === 'string' &&
          typeof answer.is_correct === 'boolean',
      )
    : []

/** Читает пары страницы сопоставления (passthrough-поле `pairs`). */
export const readSetPagePairs = (page: TSetPage): TPagePair[] =>
  Array.isArray(page.pairs)
    ? page.pairs.filter(
        (pair): pair is TPagePair =>
          typeof pair === 'object' &&
          pair !== null &&
          typeof pair.left_id === 'string' &&
          typeof pair.right_id === 'string',
      )
    : []

/** Читает категории страницы распределения (passthrough-поле `categories`). */
export const readSetPageCategories = (page: TSetPage): TPageCategory[] =>
  Array.isArray(page.categories)
    ? page.categories.filter(
        (category): category is TPageCategory =>
          typeof category === 'object' &&
          category !== null &&
          typeof category.id === 'string' &&
          (category.element_id === undefined || typeof category.element_id === 'string') &&
          (category.name === undefined || typeof category.name === 'string') &&
          Array.isArray(category.items) &&
          category.items.every((item: unknown) => typeof item === 'string'),
      )
    : []

/** Читает порядок страницы последовательности (passthrough-поле `sequence`). */
export const readSetPageSequence = (page: TSetPage): TPageSequenceItem[] =>
  Array.isArray(page.sequence)
    ? page.sequence.filter(
        (item): item is TPageSequenceItem =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.element_id === 'string' &&
          typeof item.order === 'number',
      )
    : []

export const getSetPageStructure = (page: TSetPage): TSetPageStructure => {
  switch (page.type) {
    case 'matching':
      return {
        primaryLabel: 'Количество пар',
        primaryCount: Math.max(
          1,
          readSetPagePairs(page).length || Math.ceil(page.elements.length / 2),
        ),
        primaryMin: 1,
        primaryMax: 100,
      }

    case 'sequence':
      return {
        primaryLabel: 'Количество карточек',
        primaryCount: page.elements.length,
        primaryMin: 2,
        primaryMax: 24,
      }

    case 'categories': {
      const categories = readSetPageCategories(page)
      const categoryCount = Math.max(1, categories.length)
      const itemCount = Math.max(
        1,
        categories[0]?.items.length ?? Math.ceil(page.elements.length / categoryCount),
      )

      return {
        primaryLabel: 'Количество категорий',
        primaryCount: categoryCount,
        primaryMin: 1,
        primaryMax: 100,
        secondaryLabel: 'Кол-во вариантов ответов',
        secondaryCount: itemCount,
        secondaryMin: 1,
        secondaryMax: 100,
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
    readSetPageAnswers(page).map((answer) => [answer.element_id, answer.is_correct]),
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

export const resizeMatchingPage = (page: TSetPage, pairCount: number): TSetPage => {
  const elementById = new Map(page.elements.map((element) => [element.id, element]))
  const currentPairs = readSetPagePairs(page)
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
  const currentCategories = readSetPageCategories(page)
  const elements: TSetPageElement[] = []
  const categories: TPageCategory[] = []

  for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex += 1) {
    const currentCategory = currentCategories[categoryIndex]
    const headerFromPage =
      currentCategory?.element_id != null ? elementById.get(currentCategory.element_id) : undefined
    const header = headerFromPage ?? createTextElement()
    const categoryElements = resizeElements(
      (currentCategory?.items ?? [])
        .filter((id) => id !== header.id)
        .flatMap((id) => {
          const element = elementById.get(id)
          return element ? [element] : []
        }),
      itemCount,
    )

    elements.push(header, ...categoryElements)
    categories.push({
      id: currentCategory?.id ?? crypto.randomUUID(),
      element_id: header.id,
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
