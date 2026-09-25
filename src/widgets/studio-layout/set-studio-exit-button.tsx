import {
  setQueryKeys,
  useSaveSetEditor,
  useSet,
  useSetAccess,
  useSetEditorStore,
} from '@entities/set'
import { Button } from '@mantine/core'
import { useIsMutating } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { useSetStudioRoute } from './model/use-set-studio-route'
import styles from './set-studio-controls.module.scss'

export const SetStudioExitButton: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isEditorRoute, isSubsetPreview, resolvedSetId, setOverviewUrl } = useSetStudioRoute()
  const setQuery = useSet(resolvedSetId)
  const { backUrl, canEditSet } = useSetAccess(setQuery.data?.folderId)
  const save = useSaveSetEditor(resolvedSetId)
  const editorSaving = useSetEditorStore((state) => state.setId === resolvedSetId && state.isSaving)
  const isSaving =
    useIsMutating({
      mutationKey: setQueryKeys.detail(resolvedSetId),
    }) > 0

  if (!isEditorRoute && !(isSubsetPreview && canEditSet)) {
    return null
  }

  const handleExit = async () => {
    if (!(await save())) {
      return
    }
    if (setOverviewUrl) {
      navigate(setOverviewUrl, { state: location.state })
      return
    }

    navigate(backUrl)
  }

  return (
    <Button className={styles.exitButton} loading={isSaving || editorSaving} onClick={handleExit}>
      Сохранить и выйти
    </Button>
  )
}
