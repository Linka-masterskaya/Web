import { setQueryKeys } from '@entities/set'
import { Button } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useIsMutating } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioExitButton: React.FC = () => {
  const navigate = useNavigate()
  const { isEditorRoute, resolvedSetId, setOverviewUrl } = useSetStudioRoute()
  const isSaving =
    useIsMutating({
      mutationKey: setQueryKeys.detail(resolvedSetId),
    }) > 0

  if (!isEditorRoute) {
    return null
  }

  const handleExit = () => {
    if (setOverviewUrl) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createUrl(routerPath.dashboardSets))
  }

  return (
    <Button className={styles.exitButton} loading={isSaving} onClick={handleExit}>
      Сохранить и выйти
    </Button>
  )
}
