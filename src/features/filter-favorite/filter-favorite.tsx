import { ActionIcon } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useCallback } from 'react'
import { FILTER_FAVORITE_ACTIVE_VALUE, FILTER_FAVORITE_QUERY_PARAM } from './config'
import styles from './filter-favorite.module.scss'

export const FilterFavorite: React.FC = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const isActive = queryParams[FILTER_FAVORITE_QUERY_PARAM] === FILTER_FAVORITE_ACTIVE_VALUE

  const handleToggle = useCallback(() => {
    setQueryParams({
      [FILTER_FAVORITE_QUERY_PARAM]: isActive ? null : FILTER_FAVORITE_ACTIVE_VALUE,
    })
  }, [isActive, setQueryParams])

  return (
    <ActionIcon
      className={clsx(styles.button, isActive && styles.buttonActive)}
      size={28}
      variant="transparent"
      aria-label="Фильтр избранного"
      aria-pressed={isActive}
      onClick={handleToggle}
    >
      <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
    </ActionIcon>
  )
}
