import {
  STUDENT_DEFAULT_SORT_FIELD,
  type TStudent,
  type TStudentsListParams,
  useStudents,
} from '@entities/student'
import { Center, Loader, Stack, Text } from '@mantine/core'
import { getSchemaValidationMessage } from '@shared/lib/api'
import { useModal } from '@shared/lib/modal'
import {
  createUrl,
  routerPath,
  type TRouteQueryParamsUpdate,
  useRouteQueryParams,
} from '@shared/lib/routes'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { Icon } from '@shared/ui/icon'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { STUDENT_LIST_DEFAULT_VIEW } from '../config'
import styles from '../student-list.module.scss'
import { parseStudentsListParams } from '../utils/parse-students-list-params'
import { createStudentContextMenuConfig } from './context-menu-config'
import { DeleteStudentPopup } from './delete-student-popup'
import { StudentGrid } from './student-grid'
import { StudentTable } from './student-table'

type TStudentListProps = {
  onCreateStudent?: () => void
  onEditStudent?: (student: TStudent) => void
}

const compareValues = (
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number => {
  if (a == null && b == null) {
    return 0
  }
  if (a == null) {
    return 1
  }
  if (b == null) {
    return -1
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return String(a).localeCompare(String(b), 'ru')
}

export const StudentList: React.FC<TStudentListProps> = ({ onCreateStudent, onEditStudent }) => {
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const { open, close } = useModal()
  const navigate = useNavigate()

  const { data: students = [], isPending, isFetching, isError, error } = useStudents()

  const listParams = useMemo<TStudentsListParams>(
    () => parseStudentsListParams(queryParams),
    [queryParams],
  )

  // Backend отдаёт всех учеников разом — фильтрация и сортировка на клиенте
  const visibleStudents = useMemo(() => {
    let result = students

    const q = listParams.query?.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(q) || student.email.toLowerCase().includes(q),
      )
    }

    if (listParams.age !== undefined) {
      result = result.filter((student) => student.age === listParams.age)
    }

    const sort = listParams.sort ?? STUDENT_DEFAULT_SORT_FIELD
    const order = listParams.order === 'desc' ? -1 : 1

    return [...result].sort((a, b) => compareValues(a[sort], b[sort]) * order)
  }, [students, listParams])

  const viewMode = queryParams.view === 'grid' ? 'grid' : STUDENT_LIST_DEFAULT_VIEW

  // Левый клик по строке/карточке — переход на полку ученика
  const handleOpenShelf = useCallback(
    (student: TStudent) => {
      navigate(createUrl(routerPath.studentId, { id: student.id }))
    },
    [navigate],
  )

  const handleSortToggle = useCallback(
    (field: string) => {
      const update: TRouteQueryParamsUpdate = {}
      if (listParams.sort === field) {
        // Переключаем порядок
        update.sort = field
        update.order = listParams.order === 'asc' ? 'desc' : 'asc'
      } else {
        // Новая сортировка
        update.sort = field
        update.order = 'asc'
      }
      setQueryParams(update)
    },
    [listParams.sort, listParams.order, setQueryParams],
  )

  const contextMenuItems = useMemo<TContextMenuItem<TStudent>[]>(() => {
    const items = createStudentContextMenuConfig({
      onEditProfile: (student: TStudent) => {
        onEditStudent?.(student)
      },
      onDelete: (student: TStudent) => {
        open({
          content: <DeleteStudentPopup student={student} onClose={close} />,
          size: 'sm',
          // У контента свой крестик (PopupLayout) — дублирующий скрываем
          withCloseButton: false,
        })
      },
    })

    return onEditStudent ? items : items.filter((item) => item.id !== 'edit-profile')
  }, [onEditStudent, open, close])

  if (isPending) {
    return (
      <Center py={60}>
        <Loader size="lg" />
      </Center>
    )
  }

  if (isError) {
    const schemaMessage = getSchemaValidationMessage(error)

    return (
      <Center py={60}>
        <Stack align="center" gap="sm">
          <Icon name="AlertCircle" size={40} color="var(--mantine-color-red-6)" />
          <Text c="red" ta="center">
            Не удалось загрузить список учеников
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {schemaMessage ?? error?.message ?? 'Попробуйте обновить страницу'}
          </Text>
        </Stack>
      </Center>
    )
  }

  if (visibleStudents.length === 0) {
    return (
      <Center py={60}>
        <Stack align="center" gap="sm">
          <Icon name="Users" size={40} color="var(--mantine-color-dimmed)" />
          <Text c="dimmed" ta="center">
            Ученики не найдены
          </Text>
          {onCreateStudent && (
            <Text size="sm" c="dimmed" ta="center">
              Нажмите «Добавить ученика», чтобы создать первого
            </Text>
          )}
        </Stack>
      </Center>
    )
  }

  return (
    <Stack gap="md">
      {isFetching && !isPending && <Loader size="sm" className={styles.fetchingLoader} />}

      {viewMode === 'grid' ? (
        <StudentGrid
          students={visibleStudents}
          contextMenuItems={contextMenuItems}
          onOpenShelf={handleOpenShelf}
        />
      ) : (
        <StudentTable
          students={visibleStudents}
          params={listParams}
          contextMenuItems={contextMenuItems}
          onSortToggle={handleSortToggle}
          onOpenShelf={handleOpenShelf}
        />
      )}
    </Stack>
  )
}
