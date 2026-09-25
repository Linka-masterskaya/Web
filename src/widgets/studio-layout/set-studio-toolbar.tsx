import { useSet, useSetAccess } from '@entities/set'
import { useOpenSetSettings } from '@features/set-settings'
import { Slider, Text, UnstyledButton } from '@mantine/core'
import { createSetSectionQuery, createUrl, routerPath } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioToolbar: React.FC = () => {
  const { isSetOverview, isSubsetPreview, resolvedSetId, resolvedSubsetId } = useSetStudioRoute()

  const navigate = useNavigate()
  const setQuery = useSet(resolvedSetId)
  const { canEditSet, section } = useSetAccess(setQuery.data?.folderId)
  const sectionQuery = createSetSectionQuery(section)
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
        {totalPages > 1 && (
          <Slider
            classNames={{
              root: styles.previewSlider,
              track: styles.previewSliderTrack,
              bar: styles.previewSliderBar,
              thumb: styles.previewSliderThumb,
            }}
            min={1}
            max={totalPages}
            value={Math.max(1, currentPage)}
            label={null}
            onChange={(value) => {
              const page = pages[value - 1]
              if (!page) {
                return
              }

              navigate(
                createUrl(
                  routerPath.dashboardSubsetId,
                  {
                    setId: resolvedSetId,
                    subsetId: page.id,
                  },
                  sectionQuery,
                ),
              )
            }}
          />
        )}
      </section>
    )
  }
  if (!isSetOverview || !canEditSet) {
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
