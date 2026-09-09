import type { TSetPage } from '../model/set-config.schema'

export const getSetPageTitle = (page: TSetPage, index: number) => {
  const textElement = page.elements.find(
    (element) => element.kind === 'text' && element.value?.trim(),
  )

  if (textElement?.value?.trim()) {
    return textElement.value.trim()
  }

  return `Страница ${index + 1}`
}
