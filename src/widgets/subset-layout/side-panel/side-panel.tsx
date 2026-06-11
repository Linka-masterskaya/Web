import { ActionIcon } from '@mantine/core'
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react'
import styles from './side-panel.module.scss'
import type { TSidePanelProps } from './types'

export const SidePanel: React.FC<TSidePanelProps> = ({ side, opened, onToggle, children }) => {
  const Icon = getIcon(side)
  const buttonLabel =
    side === 'left'
      ? opened
        ? 'Закрыть левую панель'
        : 'Открыть левую панель'
      : opened
        ? 'Закрыть правую панель'
        : 'Открыть правую панель'

  return (
    <aside className={styles.panel} data-opened={opened ? 'true' : 'false'} data-side={side}>
      <ActionIcon
        className={styles.icon}
        variant="subtle"
        size="sm"
        radius="sm"
        onClick={onToggle}
        aria-label={buttonLabel}
      >
        <Icon size={24} />
      </ActionIcon>

      <div className={styles.content}>{children}</div>
    </aside>
  )
}

const getIcon = (side: 'left' | 'right') => {
  if (side === 'left') {
    return PanelLeftIcon
  }

  return PanelRightIcon
}
