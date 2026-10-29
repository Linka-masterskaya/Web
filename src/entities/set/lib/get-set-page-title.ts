import type { TSetPage } from '../model/set-config.schema'

export const getSetPageTitle = (page: TSetPage, index: number) => {
  if (page.name?.trim()) {
    return page.name.trim()
  }

  return `Страница ${index + 1}`
}
