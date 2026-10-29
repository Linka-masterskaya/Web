import { createUrl, routerPath } from '@shared/lib/routes'

import type { TCreateEntityConfig } from './types'

export const createEntityConfig = {
  actions: [
    {
      label: 'Новый набор',
      link: createUrl(routerPath.dashboardSetsNew),
      icon: 'Grid3x3',
    },
    {
      // TODO: Заменить временный link после появления API создания папки.
      // Создание папки будет происходить через вызов ручки backend,
      // а не через статический роут.
      // Пока оставлена заглушка для отображения действия по макету.
      label: 'Новая папка',
      link: '#',
      icon: 'Folder',
    },
  ],
} satisfies TCreateEntityConfig
