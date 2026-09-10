import type { TSetPage, TSetPageElement } from '../model/set-config.schema'
import {
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
} from './set-page-structure'

/**
 * Глубокая копия страницы (block) с новыми идентификаторами — для дублирования
 * и для вставки из буфера обмена.
 *
 * Заменяются id страницы, id элементов и все ссылки на элементы:
 * `answers.element_id`, `pairs.left_id`/`right_id`, `categories.items`, `sequence.element_id`.
 */
export const cloneSetPage = (page: TSetPage): TSetPage => {
  const elementIdMap = new Map<string, string>()

  const elements: TSetPageElement[] = page.elements.map((element) => {
    const id = crypto.randomUUID()
    elementIdMap.set(element.id, id)

    return { ...element, id }
  })

  const remapElementId = (elementId: string) => elementIdMap.get(elementId) ?? elementId

  const clone: TSetPage = { ...page, id: crypto.randomUUID(), elements }

  if (Array.isArray(page.answers)) {
    clone.answers = readSetPageAnswers(page).map((answer) => ({
      element_id: remapElementId(answer.element_id),
      is_correct: answer.is_correct,
    }))
  }

  if (Array.isArray(page.pairs)) {
    clone.pairs = readSetPagePairs(page).map((pair) => ({
      left_id: remapElementId(pair.left_id),
      right_id: remapElementId(pair.right_id),
    }))
  }

  if (Array.isArray(page.categories)) {
    clone.categories = readSetPageCategories(page).map((category) => ({
      id: crypto.randomUUID(),
      name: category.name,
      items: category.items.map(remapElementId),
    }))
  }

  if (Array.isArray(page.sequence)) {
    clone.sequence = readSetPageSequence(page).map((item) => ({
      element_id: remapElementId(item.element_id),
      order: item.order,
    }))
  }

  return clone
}
