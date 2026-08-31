import type { TStudent } from '@entities/student'
import { ViewToggle } from '@features/view-toggle'
import { Card, Group, Image, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { BackButton } from '@shared/ui/back-button'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { ContextMenu, useContextMenu } from '@shared/ui/context-menu'
import { Icon } from '@shared/ui/icon'
import type React from 'react'
import styles from './student-grid.module.scss'

type TStudentGridProps = {
  students: TStudent[]
  contextMenuItems: readonly TContextMenuItem<TStudent>[]
  onOpenShelf: (student: TStudent) => void
}

export const StudentGrid: React.FC<TStudentGridProps> = ({
  students,
  contextMenuItems,
  onOpenShelf,
}) => {
  const contextMenu = useContextMenu<TStudent>({
    width: 235,
    estimatedHeight: 130,
    viewportMargin: 8,
  })

  return (
    <>
      <ContextMenu<TStudent> items={contextMenuItems} {...contextMenu.menuProps} />
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
            onContextMenu={(event) => {
              contextMenu.open(event, student)
            }}
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
    </>
  )
}
