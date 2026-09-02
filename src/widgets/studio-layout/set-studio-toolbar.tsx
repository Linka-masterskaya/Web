import { useSet } from '@entities/set'
import { useOpenSetSettings } from '@features/set-settings'
import { Text, UnstyledButton } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioToolbar: React.FC = () => {
  const { isEditorRoute, resolvedSetId } = useSetStudioRoute()
  const setQuery = useSet(resolvedSetId)
  const openSetSettings = useOpenSetSettings()

  if (!isEditorRoute) {
    return null
  }

  return (
    <div className={styles.toolbarGroup}>
      <UnstyledButton
        className={styles.toolbarButton}
        onClick={() => {
          if (setQuery.data) {
            openSetSettings(setQuery.data)
          }
        }}
        disabled={!setQuery.data || setQuery.isLoading}
        aria-label="Открыть настройки набора"
      >
        <Icon name="Settings" size={24} />
        <Text component="span" className={styles.toolbarLabel}>
          Настройки
        </Text>
      </UnstyledButton>
    </div>
  )
}
