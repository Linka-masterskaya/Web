import type { TStudent } from '@entities/student'
import { ViewToggle } from '@features/view-toggle'
import { Card, Group, Image, Menu, Text } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { createUrl, routerPath } from '@shared/lib/routes'
import { BackButton } from '@shared/ui/back-button'
import { Icon } from '@shared/ui/icon'
import React, { useCallback, useState } from 'react'
import type { TContextMenuItem } from './context-menu-config'
import styles from './student-grid.module.scss'

type TStudentGridProps = {
  students: TStudent[]
  contextMenuItems: TContextMenuItem[]
  onOpenShelf: (student: TStudent) => void
}

export const StudentGrid: React.FC<TStudentGridProps> = ({
  students,
  contextMenuItems,
  onOpenShelf,
}) => {
  const [contextMenuStudent, setContextMenuStudent] = useState<TStudent | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [menuOpened, setMenuOpened] = useState(false)

  // Размеры контекстного меню для клампинга в пределах окна
  const MENU_WIDTH = 235
  const MENU_ESTIMATED_HEIGHT = 130
  const MENU_VIEWPORT_MARGIN = 8

  const closeContextMenu = useCallback(() => {
    setMenuOpened(false)
    setContextMenuStudent(null)
  }, [])

  const menuRef = useClickOutside(closeContextMenu)

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

  const handleCardContextMenu = useCallback((event: React.MouseEvent, student: TStudent) => {
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onContextMenu = useCallback(
    (student: TStudent) => (event: React.MouseEvent) => handleCardContextMenu(event, student),
    [handleCardContextMenu],
  )

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.gridHeader}>
          <ViewToggle />
        </div>
        {/* Назад = дашборд (явный маршрут надёжнее navigate(-1)) */}
        <BackButton variant="tile" to={createUrl(routerPath.dashboard)} />
        {students.map((student) => (
          <Card
            key={student.id}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            onContextMenu={onContextMenu(student)}
            onClick={() => onOpenShelf(student)}
            className={styles.card}
          >
            {student.avatar_url ? (
              <Image
                src={student.avatar_url}
                alt={student.name}
                radius="md"
                w="auto"
                h={180}
                fit="contain"
              />
            ) : (
              <Group justify="center" className={styles.avatarPlaceholder}>
                <Icon name="UserRound" size={72} color="var(--mantine-color-blue-4)" />
              </Group>
            )}

            <Text ta="left" fw={600} mt="sm">
              {(() => {
                const parts = student.name.trim().split(' ')
                return `${parts[0]} ${parts[1] ? parts[1][0] + '.' : ''}`.trim()
              })()}
            </Text>
          </Card>
        ))}
      </div>

      {/* Контекстное меню по правому клику на карточке */}
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
