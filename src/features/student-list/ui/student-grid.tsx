import type { TStudent } from '@entities/student'
import { ViewToggle } from '@features/view-toggle'
import { Card, Image, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import gridStyles from '@shared/styles/stretch-card-grid.module.scss'
import { BackButton } from '@shared/ui/back-button'
import type { TContextMenuItem } from '@shared/ui/context-menu'
import { ContextMenu, useContextMenu } from '@shared/ui/context-menu'
import { Icon } from '@shared/ui/icon'
import clsx from 'clsx'
import type React from 'react'
import styles from './student-grid.module.scss'

type TStudentGridProps = {
  students: TStudent[]
  contextMenuItems: readonly TContextMenuItem<TStudent>[]
  onOpenShelf: (student: TStudent) => void
}

const formatStudentName = (name: string) => {
  const parts = name.trim().split(' ')
  return `${parts[0]} ${parts[1] ? `${parts[1][0]}.` : ''}`.trim()
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
      <div className={gridStyles.grid}>
        <div className={styles.gridHeader}>
          <ViewToggle />
        </div>
        <BackButton
          variant="tile"
          className={clsx(gridStyles.card, styles.tile)}
          to={createUrl(routerPath.dashboard)}
        />
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
            className={clsx(gridStyles.card, styles.card)}
          >
            {student.avatar_url ? (
              <Image
                src={student.avatar_url}
                alt={student.name}
                radius="md"
                w="100%"
                className={styles.media}
                fit="contain"
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <Icon name="UserRound" size={72} color="var(--mantine-color-blue-4)" />
              </div>
            )}

            <Text ta="left" fw={600} mt="sm" className={styles.label} title={student.name}>
              {formatStudentName(student.name)}
            </Text>
          </Card>
        ))}
      </div>
    </>
  )
}
