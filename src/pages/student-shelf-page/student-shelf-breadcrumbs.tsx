import { useStudent } from '@entities/student'
import { createUrl, routerPath } from '@shared/lib/routes'
import { BreadCrumbs } from '@shared/ui/bread-crumbs'
import { useParams } from 'react-router'

const formatStudentName = (name: string): string => {
  const parts = name.trim().split(' ')
  return `${parts[0]} ${parts[1] ? parts[1][0] + '.' : ''}`.trim()
}

/** Хлебные крошки полки ученика: Главная / Картотека учеников / Полка ученика (Имя Ф.) */
export const StudentShelfBreadcrumbs: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: student } = useStudent(id ?? '')

  const items = [
    { id: 'dashboard', label: 'Главная', href: createUrl(routerPath.dashboard) },
    {
      id: 'students',
      label: 'Картотека учеников',
      href: createUrl(routerPath.dashboardStudents),
    },
  ]

  if (student) {
    items.push({
      id: 'shelf',
      label: `Полка ученика (${formatStudentName(student.name)})`,
      href: createUrl(routerPath.studentId, { id: student.id }),
    })
  }

  return <BreadCrumbs items={items} />
}
