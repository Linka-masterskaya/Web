import { routerPath } from '@shared/lib/routes'
import { matchPath, useLocation } from 'react-router'
import { dashboardRootLabel, findDashboardSectionByPath } from './dashboard-sections'

const studentShelfLabel = 'Полка ученика'
const studentShelfPattern = `/${routerPath.studentId}`

/**
 * Заголовок хедера дашборда: имя текущего раздела.
 * Держим его в согласии с хлебными крошками — берём те же подписи.
 */
export const DashboardHeaderTitle: React.FC = () => {
  const { pathname } = useLocation()

  const section = findDashboardSectionByPath(pathname)

  if (section) {
    return <>{section.label}</>
  }

  if (matchPath(studentShelfPattern, pathname)) {
    return <>{studentShelfLabel}</>
  }

  return <>{dashboardRootLabel}</>
}
