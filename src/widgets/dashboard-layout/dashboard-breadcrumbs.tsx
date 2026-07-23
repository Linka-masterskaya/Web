import { createUrl, routerPath } from '@shared/lib/routes'
import { BreadCrumbs } from '@shared/ui/bread-crumbs'
import { useLocation } from 'react-router'

const dashboardUrl = createUrl(routerPath.dashboard)

const dashboardBreadcrumbSections = [
  {
    path: createUrl(routerPath.dashboardLibrary),
    label: 'Библиотека',
  },
  {
    path: createUrl(routerPath.dashboardStudents),
    label: 'Картотека учеников',
  },
  {
    path: createUrl(routerPath.dashboardSets),
    label: 'Мои наборы',
  },
] as const

const isCurrentSectionPath = (pathname: string, sectionPath: string) =>
  pathname === sectionPath || pathname.startsWith(`${sectionPath}/`)

export const DashboardBreadcrumbs: React.FC = () => {
  const { pathname } = useLocation()
  const currentSection = dashboardBreadcrumbSections.find((section) =>
    isCurrentSectionPath(pathname, section.path),
  )

  const items = [
    {
      id: 'dashboard',
      label: 'Главная',
      href: dashboardUrl,
    },
  ]

  if (currentSection) {
    items.push({
      id: currentSection.path,
      label: currentSection.label,
      href: currentSection.path,
    })
  }

  return <BreadCrumbs items={items} />
}
