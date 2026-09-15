import { setQueryKeys, useSaveSetEditor, useSet, useSetEditorStore } from '@entities/set'
import { Button } from '@mantine/core'
import { createDashboardSetsUrl } from '@shared/lib/routes'
import { useIsMutating } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioExitButton: React.FC = () => {
  const navigate = useNavigate()
  const { isEditorRoute, resolvedSetId, setOverviewUrl } = useSetStudioRoute()
  const setQuery = useSet(resolvedSetId)
  const save = useSaveSetEditor(resolvedSetId)
  const editorSaving = useSetEditorStore((state) => state.setId === resolvedSetId && state.isSaving)
  const isSaving =
    useIsMutating({
      mutationKey: setQueryKeys.detail(resolvedSetId),
    }) > 0

  if (!isEditorRoute) {
    return null
  }

  const handleExit = async () => {
    if (!(await save())) {
      return
    }
    if (setOverviewUrl) {
      navigate(setOverviewUrl)
      return
    }

    navigate(createDashboardSetsUrl(setQuery.data?.folderId))
  }

  return (
    <Button className={styles.exitButton} loading={isSaving || editorSaving} onClick={handleExit}>
      Сохранить и выйти
    </Button>
  )
}
