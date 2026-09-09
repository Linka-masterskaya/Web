import { useCreateSet, useUpdateSet } from '@entities/set'
import { SetSettings } from '@features/set-settings'
import type { TSetSettings } from '@features/set-settings/model/set-settings.schema'

import { createUrl, routerPath } from '@shared/lib/routes'
import { PopupLayout } from '@shared/ui/popup-layout'

import { useNavigate } from 'react-router'
import { z } from 'zod'

import type { TCreateSetModalProps } from './types'

const folderIdSchema = z.string().uuid()

export const CreateSetModal: React.FC<TCreateSetModalProps> = ({ folderId = null, onClose }) => {
  const navigate = useNavigate()
  const createSetMutation = useCreateSet()
  const updateSetMutation = useUpdateSet()

  const parsedFolderId = folderIdSchema.safeParse(folderId ?? undefined)
  const resolvedFolderId = parsedFolderId.success ? parsedFolderId.data : null

  const handleSave = async (values: TSetSettings) => {
    if (!resolvedFolderId) {
      return
    }

    const set = await createSetMutation.mutateAsync({
      title: values.title.trim(),
      folderId: resolvedFolderId,
    })

    const age = Number.parseInt(values.age, 10)

    await updateSetMutation.mutateAsync({
      id: set.id,
      title: values.title.trim(),
      folderId: resolvedFolderId,
      age,
      difficulty: values.level,
      goals: [],
      notes: values.notes,
    })

    navigate(
      createUrl(routerPath.dashboardSubsetNew, {
        setId: set.id,
      }),
    )

    onClose()
  }

  if (!resolvedFolderId) {
    return (
      <PopupLayout onClose={onClose}>
        <div>Набор можно создать только внутри папки. Откройте папку и попробуйте снова.</div>
      </PopupLayout>
    )
  }

  return <SetSettings onClose={onClose} onSave={handleSave} />
}
