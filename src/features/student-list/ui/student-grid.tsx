import type { TStudent } from '@entities/student'
import { Card, Group, Image, Menu, Text } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { Icon } from '@shared/ui/icon'
import React, { useCallback, useState } from 'react'
import type { TContextMenuItem } from './context-menu-config'
import styles from './student-grid.module.scss'

type TStudentGridProps = {
  students: TStudent[]
  contextMenuItems: TContextMenuItem[]
}

export const StudentGrid: React.FC<TStudentGridProps> = ({ students, contextMenuItems }) => {
  const [contextMenuStudent, setContextMenuStudent] = useState<TStudent | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [menuOpened, setMenuOpened] = useState(false)

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
    setMenuPosition({ x: event.clientX, y: event.clientY })
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
        {students.map((student) => (
          <Card
            key={student.id}
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            onContextMenu={onContextMenu(student)}
            className={styles.card}
          >
            {student.avatarSrc ? (
              <Image src={student.avatarSrc} alt={student.name} radius="md" w="auto" h={180} />
            ) : (
              <Group justify="center" className={styles.avatarPlaceholder}>
                <Icon name="UserRound" size={60} color="var(--mantine-color-blue-4)" />
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
