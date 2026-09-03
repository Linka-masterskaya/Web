import { ActionIcon } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import styles from './side-panel.module.scss'
import type { TSidePanelProps } from './types'

export const SidePanel: React.FC<TSidePanelProps> = ({
  id,
  side,
  title,
  opened,
  collapsible,
  onToggle,
  collapsedContent,
  children,
}) => {
  const hasHeader = collapsible || title != null
  const titleId = `${id}-title`
  const actionLabel = opened
    ? side === 'left'
      ? 'Скрыть левую панель'
      : 'Скрыть правую панель'
    : side === 'left'
      ? 'Показать левую панель'
      : 'Показать правую панель'
  const actionIcon = opened
    ? side === 'left'
      ? 'PanelLeftClose'
      : 'PanelRightClose'
    : side === 'left'
      ? 'PanelLeftOpen'
      : 'PanelRightOpen'

  const toggleButton = collapsible ? (
    <ActionIcon
      variant="transparent"
      color="dark"
      size={32}
      onClick={onToggle}
      aria-label={actionLabel}
      aria-controls={id}
      aria-expanded={opened}
    >
      <Icon name={actionIcon} size={22} />
    </ActionIcon>
  ) : null

  return (
    <aside
      id={id}
      className={styles.panel}
      data-side={side}
      data-opened={opened ? 'true' : 'false'}
      data-has-header={hasHeader ? 'true' : 'false'}
      aria-labelledby={opened && title != null ? titleId : undefined}
    >
      {hasHeader && (
        <div className={styles.header}>
          {!opened ? (
            toggleButton
          ) : (
            <>
              {side === 'right' && collapsible ? (
                toggleButton
              ) : (
                <span className={styles.headerSpacer} aria-hidden="true" />
              )}

              {title != null && (
                <div id={titleId} className={styles.title}>
                  {title}
                </div>
              )}

              {side === 'left' && collapsible ? (
                toggleButton
              ) : (
                <span className={styles.headerSpacer} aria-hidden="true" />
              )}
            </>
          )}
        </div>
      )}

      <div className={styles.body}>{opened ? children : collapsedContent}</div>
    </aside>
  )
}
