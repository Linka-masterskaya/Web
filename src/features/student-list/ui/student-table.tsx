import { STUDENT_STATUS_LABELS, type TStudent, type TStudentsListParams } from '@entities/student'
import { Table, Text } from '@mantine/core'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { ContextMenu, useContextMenu } from '@shared/ui/context-menu'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import type React from 'react'
import styles from './student-table.module.scss'

type TStudentTableProps = {
  students: TStudent[]
  params: TStudentsListParams
  contextMenuItems: TContextMenuItem<TStudent>[]
  onSortToggle: (field: string) => void
  onOpenShelf: (student: TStudent) => void
}

export const StudentTable: React.FC<TStudentTableProps> = ({
  students,
  params,
  contextMenuItems,
  onSortToggle,
  onOpenShelf,
}) => {
  const contextMenu = useContextMenu<TStudent>({
    width: 235,
    estimatedHeight: 130,
    viewportMargin: 8,
  })

  const renderSortIcon = (field: string) => {
    if (params.sort !== field) {
      return <Icon name="ChevronDown" size={14} color="var(--mantine-color-dimmed)" />
    }
    return params.order === 'asc' ? (
      <Icon name="ChevronUp" size={14} />
    ) : (
      <Icon name="ChevronDown" size={14} />
    )
  }

  const formatDate = (isoString?: string | null): string => {
    if (!isoString) {
      return '—'
    }
    const date = new Date(isoString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <>
      <ContextMenu<TStudent> items={contextMenuItems} {...contextMenu.menuProps} />
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={clsx(styles.cell, styles.numberCell)}>
              <Text size="md" fw={600}>
                №
              </Text>
            </Table.Th>
            <Table.Th className={styles.cell}>
              <Text size="md" fw={600}>
                Имя ученика
              </Text>
            </Table.Th>
            <Table.Th className={styles.cell}>
              <Text size="md" fw={600}>
                Email
              </Text>
            </Table.Th>
            <Table.Th
              className={clsx(styles.cell, styles.sortableHeader)}
              onClick={() => onSortToggle('age')}
            >
              <Text component="span" fw={600} size="md" className={styles.sortLabel}>
                Возраст
                {renderSortIcon('age')}
              </Text>
            </Table.Th>
            <Table.Th
              className={clsx(styles.cell, styles.sortableHeader)}
              onClick={() => onSortToggle('status')}
            >
              <Text component="span" fw={600} size="md" className={styles.sortLabel}>
                Статус
                {renderSortIcon('status')}
              </Text>
            </Table.Th>
            <Table.Th className={styles.cell}>
              <Text size="md" fw={600}>
                Создан
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {students.map((student, index) => {
            const rowNumber = index + 1

            return (
              <Table.Tr
                key={student.id}
                data-status={student.status}
                onContextMenu={(event) => {
                  contextMenu.open(event, student)
                }}
                onClick={() => onOpenShelf(student)}
                className={styles.row}
              >
                <Table.Td className={clsx(styles.cell, styles.numberCell)}>
                  <Text size="sm">{rowNumber}</Text>
                </Table.Td>
                <Table.Td className={styles.cell}>
                  <div className={styles.studentCell}>
                    <Text size="sm" fw={500}>
                      {student.name}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td className={styles.cell}>
                  <Text size="sm">{student.email}</Text>
                </Table.Td>
                <Table.Td className={styles.cell}>
                  <Text size="sm">{student.age ?? '—'}</Text>
                </Table.Td>
                <Table.Td className={styles.cell}>
                  <Text size="sm">{STUDENT_STATUS_LABELS[student.status]}</Text>
                </Table.Td>
                <Table.Td className={styles.cell}>
                  <Text size="sm">{formatDate(student.created_at)}</Text>
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </>
  )
}
