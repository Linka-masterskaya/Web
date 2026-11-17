import type { TSetPage, TSetPageType } from '@entities/set'
import {
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
} from '@entities/set'

/** Меняется представление задания, а не его карточки. Поля других режимов сохраняются, список нового типа ссылается только на существующие карточки. */
export const changeSetPageType = (page: TSetPage, type: TSetPageType): TSetPage => {
  if (page.type === type) {
    return page
  }
  const next: TSetPage = { ...page, type, elements: [...page.elements] }
  if (type === 'grid') {
    const columns = next.layout?.columns ?? 3
    const rows = Math.max(next.layout?.rows ?? 1, Math.ceil(next.elements.length / columns) || 1)
    next.layout = { rows, columns }
  }
  const addCard = () =>
    next.elements.push({ id: crypto.randomUUID(), kind: 'text', card_type: 'normal', value: '' })
  if (type !== 'grid' && next.elements.length < 2) {
    addCard()
  }
  const liveIds = new Set(next.elements.map((element) => element.id))
  if (type === 'single_choice' || type === 'multi_choice') {
    const previous = new Map(
      readSetPageAnswers(page).map((answer) => [answer.element_id, answer.is_correct]),
    )
    let hasCorrect = false
    const answers = next.elements.map((element) => {
      const isCorrect =
        Boolean(previous.get(element.id)) && (type === 'multi_choice' || !hasCorrect)
      hasCorrect ||= isCorrect
      return { element_id: element.id, is_correct: isCorrect }
    })
    if (!hasCorrect) {
      answers[0].is_correct = true
    }
    next.answers = answers
  }
  if (type === 'matching') {
    const pairs = readSetPagePairs(page).filter(
      (pair) => liveIds.has(pair.left_id) && liveIds.has(pair.right_id),
    )
    const pairedIds = new Set(pairs.flatMap((pair) => [pair.left_id, pair.right_id]))
    const unpaired = next.elements.filter((element) => !pairedIds.has(element.id))
    if (unpaired.length % 2) {
      addCard()
      unpaired.push(next.elements[next.elements.length - 1])
    }
    next.pairs = [
      ...pairs,
      ...unpaired
        .filter((_, index) => index % 2 === 0)
        .map((element, index) => ({
          left_id: element.id,
          right_id: unpaired[index * 2 + 1].id,
        })),
    ]
  }
  if (type === 'categories') {
    const categories = readSetPageCategories(page).flatMap((category) => {
      const headerId = category.element_id || undefined
      if (headerId && !liveIds.has(headerId)) {
        return []
      }
      if (!headerId && !category.name) {
        return []
      }
      return [{ ...category, element_id: headerId }]
    })
    const headerIds = new Set(
      categories.flatMap((category) => (category.element_id ? [category.element_id] : [])),
    )
    const cleaned = categories.map((category) => ({
      ...category,
      items: category.items.filter((id) => liveIds.has(id) && !headerIds.has(id)),
    }))
    const reservedIds = new Set([...cleaned.flatMap((category) => category.items), ...headerIds])
    const unassigned = next.elements
      .filter((element) => !reservedIds.has(element.id))
      .map((element) => element.id)

    if (cleaned.length) {
      next.categories = cleaned.map((category, index) =>
        index === 0 ? { ...category, items: [...category.items, ...unassigned] } : category,
      )
    } else {
      const categoryCount = 2
      const itemCount = Math.max(1, Math.ceil(unassigned.length / categoryCount) || 1)
      const neededItems = categoryCount * itemCount
      while (unassigned.length < neededItems) {
        addCard()
        unassigned.push(next.elements[next.elements.length - 1].id)
      }
      const headers = Array.from({ length: categoryCount }, () => {
        addCard()
        return next.elements[next.elements.length - 1]
      })
      next.categories = headers.map((header, index) => ({
        id: crypto.randomUUID(),
        element_id: header.id,
        items: unassigned.slice(index * itemCount, (index + 1) * itemCount),
      }))
    }
  }
  if (type === 'sequence') {
    const sequence = readSetPageSequence(page)
      .filter((item) => liveIds.has(item.element_id))
      .toSorted((a, b) => a.order - b.order)
    const orderedIds = new Set(sequence.map((item) => item.element_id))
    const remaining = next.elements.filter((element) => !orderedIds.has(element.id))
    next.sequence = [
      ...sequence,
      ...remaining.map((element) => ({ element_id: element.id, order: 0 })),
    ].map((item, index) => ({ ...item, order: index + 1 }))
  }
  return next
}
