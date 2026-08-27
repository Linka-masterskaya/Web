import { STUDENT_STATUS_LABELS, type TStudent, type TStudentsListParams } from '@entities/student'
import { Menu, Table, Text } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import React, { useCallback, useState } from 'react'
import type { TContextMenuItem } from './context-menu-config'
import styles from './student-table.module.scss'

type TStudentTableProps = {
  students: TStudent[]
  params: TStudentsListParams
  contextMenuItems: TContextMenuItem[]
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
  const [contextMenuStudent, setContextMenuStudent] = useState<TStudent | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [menuOpened, setMenuOpened] = useState(false)

  // Размеры контекстного меню для клампинга в пределах окна
  const MENU_WIDTH = 235
  const MENU_ESTIMATED_HEIGHT = 130
  const MENU_VIEWPORT_MARGIN = 8

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

  const closeContextMenu = useCallback(() => {
    setMenuOpened(false)
    setContextMenuStudent(null)
  }, [])

  const menuRef = useClickOutside(closeContextMenu)

  const handleContextMenu = useCallback((event: React.MouseEvent, student: TStudent) => {
    event.preventDefault()
    setContextMenuStudent(student)
    // Клампинг: меню не должно выезжать за края окна
    const x = Math.min(event.clientX, window.innerWidth - MENU_WIDTH - MENU_VIEWPORT_MARGIN)
    const y = Math.min(
      event.clientY,
      window.innerHeight - MENU_ESTIMATED_HEIGHT - MENU_VIEWPORT_MARGIN,
    )
    setMenuPosition({ x: Math.max(0, x), y: Math.max(0, y) })
    setMenuOpened(true)
  }, [])

  const handleContextMenuItemClick = useCallback(
    (item: TContextMenuItem) => {
      if (contextMenuStudent) {
        item.onClick(contextMenuStudent)
      }
      closeContextMenu()
    },
    [contextMenuStudent, closeContextMenu],
  )

  const handleMenuChange = useCallback(
    (opened: boolean) => {
      if (!opened) {
        closeContextMenu()
      }
    },
    [closeContextMenu],
  )

  const formatDate = (isoString?: string): string => {
    if (!isoString) return '—'
    const date = new Date(isoString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleRowContextMenu = useCallback(
    (student: TStudent) => (event: React.MouseEvent) => handleContextMenu(event, student),
    [handleContextMenu],
  )

  return (
    <>
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
                onContextMenu={handleRowContextMenu(student)}
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
                  <Text size="sm">{student.age}</Text>
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

      {/* Контекстное меню по правому клику на строке */}
      <div
        ref={menuOpened ? menuRef : undefined}
        className={styles.menuContainer}
        style={{ left: menuPosition.x, top: menuPosition.y }}
      >
        <Menu
          opened={menuOpened}
          onChange={handleMenuChange}
          withinPortal={false}
          keepMounted
          width={235}
          position="right-start"
        >
          <Menu.Dropdown>
            {contextMenuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Menu.Divider />}
                <Menu.Item
                  c={item.color === 'red' ? 'red.6' : 'gray.6'}
                  disabled={item.disabled}
                  leftSection={item.icon}
                  onClick={() => handleContextMenuItemClick(item)}
                >
                  {item.label}
                </Menu.Item>
              </React.Fragment>
            ))}
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  )
}
