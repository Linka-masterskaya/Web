import { createUrl, routerPath } from '@shared/lib/routes'
import type { Icon } from '@shared/ui/icon'
import type { ComponentProps } from 'react'

type TDashboardCardIconName = ComponentProps<typeof Icon>['name']

type TDashboardCardGridItem = {
  id: string
  label: string
  href: string
  iconName: TDashboardCardIconName
}

export const dashboardCardGridItems = [
  {
    id: 'library',
    label: 'Библиотека',
    href: createUrl(routerPath.dashboardLibrary),
    iconName: 'LibraryBig',
  },
  {
    id: 'sets',
    label: 'Мои наборы',
    href: createUrl(routerPath.dashboardSets),
    iconName: 'Folder',
  },
  {
    id: 'students',
    label: 'Картотека учеников',
    href: createUrl(routerPath.dashboardStudents),
    iconName: 'UserRound',
  },
] satisfies TDashboardCardGridItem[]
