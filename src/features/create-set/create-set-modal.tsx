import { useCreateSet, useUpdateSet } from '@entities/set'
import { useStudent } from '@entities/student'
import { SetSettings } from '@features/set-settings'
import type { TSetSettings } from '@features/set-settings/model/set-settings.schema'
import { getApiErrorMessage } from '@shared/lib/api'
import { createSetSectionQuery, createUrl, routerPath } from '@shared/lib/routes'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import type { TCreateSetModalProps } from './types'

const folderIdSchema = z.string().uuid()

export const CreateSetModal: React.FC<TCreateSetModalProps> = ({
  folderId = null,
  studentId,
  section,
  onClose,
}) => {
  const navigate = useNavigate()
  const createSetMutation = useCreateSet()
  const updateSetMutation = useUpdateSet()
  const [submitError, setSubmitError] = useState<string>()

  const studentQuery = useStudent(studentId ?? '')

  const parsedFolderId = folderIdSchema.safeParse(folderId ?? undefined)
  const resolvedFolderId = parsedFolderId.success ? parsedFolderId.data : null

  const handleSave = async (values: TSetSettings) => {
    if (!resolvedFolderId) {
      return
    }

    setSubmitError(undefined)

    try {
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
        coverSourcePictureId: null,
      })

      navigate(
        createUrl(
          routerPath.dashboardSubsetNew,
          { setId: set.id },
          createSetSectionQuery({ section, folderId: resolvedFolderId }),
        ),
      )

      onClose()
    } catch (error) {
      setSubmitError(await getApiErrorMessage(error))
    }
  }

  if (!resolvedFolderId) {
    return (
      <PopupLayout onClose={onClose}>
        <div>Набор можно создать только внутри папки. Откройте папку и попробуйте снова.</div>
      </PopupLayout>
    )
  }

  if (studentId && studentQuery.isLoading) {
    return (
      <PopupLayout onClose={onClose}>
        <div>Загрузка...</div>
      </PopupLayout>
    )
  }

  return (
    <SetSettings
      defaultValues={
        studentQuery.data?.age != null ? { age: String(studentQuery.data.age) } : undefined
      }
      onClose={onClose}
      onSave={handleSave}
      submitError={submitError}
    />
  )
}
