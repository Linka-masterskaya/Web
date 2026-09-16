import { useSet } from '@entities/set'
import { useOpenSetSettings } from '@features/set-settings'
import { Slider, Text, UnstyledButton } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioToolbar: React.FC = () => {
  const { isSetOverview, isSubsetPreview, resolvedSetId, resolvedSubsetId } = useSetStudioRoute()

  const navigate = useNavigate()
  const setQuery = useSet(resolvedSetId)
  const openSetSettings = useOpenSetSettings()
  const pages = setQuery.data?.pages ?? []
  const activeIndex = pages.findIndex((page) => page.id === resolvedSubsetId)
  const currentPage = activeIndex >= 0 ? activeIndex + 1 : 0
  const totalPages = pages.length

  if (isSubsetPreview) {
    return (
      <section
        className={styles.previewProgress}
        aria-label={`Страница ${currentPage} из ${totalPages}`}
      >
        <Text className={styles.previewProgressLabel}>
          {currentPage}/{totalPages}
        </Text>
        <Slider
          classNames={{
            root: styles.previewSlider,
            track: styles.previewSliderTrack,
            bar: styles.previewSliderBar,
            thumb: styles.previewSliderThumb,
          }}
          min={1}
          max={Math.max(1, totalPages)}
          value={Math.max(1, currentPage)}
          label={null}
          onChange={(value) => {
            const page = pages[value - 1]
            if (!page) {
              return
            }

            navigate(
              createUrl(routerPath.dashboardSubsetId, {
                setId: resolvedSetId,
                subsetId: page.id,
              }),
            )
          }}
        />
      </section>
    )
  }
  if (!isSetOverview) {
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
