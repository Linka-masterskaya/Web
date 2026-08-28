import type { TSection } from '@entities/folder'

type TSectionBrowserConfig = {
  title: string
  rootLabel: string
  emptyText: string
}

export const sectionBrowserConfig: Record<TSection, TSectionBrowserConfig> = {
  library: {
    title: 'Библиотека',
    rootLabel: 'Библиотека',
    emptyText: 'В этой папке пока пусто',
  },

  my: {
    title: 'Мои наборы',
    rootLabel: 'Мои наборы',
    emptyText: 'В этой папке пока пусто',
  },

  students: {
    title: 'Картотека учеников',
    rootLabel: 'Картотека учеников',
    emptyText: 'В этой папке пока пусто',
  },
}
