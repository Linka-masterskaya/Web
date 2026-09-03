import { folderQueryKeys } from '@entities/folder'
import { type TSet, useUpdateSet } from '@entities/set'
import { useQueryClient } from '@tanstack/react-query'
import { SET_SETTINGS_DEFAULT_VALUES } from '../config'
import type { TSetSettings } from '../model/set-settings.schema'
import { SetSettings } from './set-settings'

type TEditSetSettingsModalProps = {
  set: TSet
  onClose: () => void
}

export const EditSetSettingsModal: React.FC<TEditSetSettingsModalProps> = ({ set, onClose }) => {
  const queryClient = useQueryClient()
  const updateSetMutation = useUpdateSet(set.id)

  const handleSave = async (values: TSetSettings) => {
    updateSetMutation.reset()

    try {
      const age = Number(values.age)

      await updateSetMutation.mutateAsync({
        id: set.id,
        title: values.title.trim(),
        folderId: set.folderId,
        ageMin: age,
        ageMax: age,
        difficulty: values.level,
        goals: set.goals ?? [],
        notes: values.notes,
      })

      await queryClient.invalidateQueries({ queryKey: folderQueryKeys.all })
      onClose()
    } catch {
      // Состояние ошибки отображается внутри формы.
    }
  }

  return (
    <SetSettings
      defaultValues={{
        title: set.title,
        age: String(set.ageMin ?? set.ageMax ?? SET_SETTINGS_DEFAULT_VALUES.age),
        level: set.difficulty ?? SET_SETTINGS_DEFAULT_VALUES.level,
        notes: set.notes ?? SET_SETTINGS_DEFAULT_VALUES.notes,
      }}
      onClose={onClose}
      onSave={handleSave}
      submitError={updateSetMutation.isError ? 'Не удалось сохранить настройки.' : undefined}
    />
  )
}
