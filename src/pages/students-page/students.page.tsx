import type { TStudent } from '@entities/student'
import { STUDENT_LIST_DEFAULT_VIEW, StudentList } from '@features/student-list'
import { ViewToggle } from '@features/view-toggle'
import { Flex, Group } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { createUrl, routerPath, useRouteQueryParams } from '@shared/lib/routes'
import { BackButton } from '@shared/ui/back-button'
import { useCallback } from 'react'
import { StudentEditorModal } from './student-editor-modal'

export const StudentsPage: React.FC = () => {
  const { open, close } = useModal()
  const { queryParams } = useRouteQueryParams()

  const handleEditStudent = useCallback(
    (student: TStudent) => {
      open({
        content: <StudentEditorModal mode="edit" student={student} onClose={close} />,
        size: 'md',
        withCloseButton: false,
      })
    },
    [open, close],
  )

  // Таблица: «Вернуться назад» слева + ViewToggle справа на странице.
  // Плитка: ViewToggle рендерится внутри StudentGrid (справа), назад — первой карточкой.
  const viewMode = queryParams.view === 'grid' ? 'grid' : STUDENT_LIST_DEFAULT_VIEW

  return (
    <Flex direction="column" gap="md">
      {viewMode === 'list' && (
        <Group justify="space-between">
          {/* Назад = дашборд (явный маршрут надёжнее navigate(-1)) */}
          <BackButton to={createUrl(routerPath.dashboard)} />
          <Group justify="flex-end">
            <ViewToggle />
          </Group>
        </Group>
      )}

      <StudentList onEditStudent={handleEditStudent} />
    </Flex>
  )
}
