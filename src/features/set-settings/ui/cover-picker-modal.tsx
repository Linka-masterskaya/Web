import type { TLibraryCard, TLibraryPictureImport } from '@entities/library'
import { useSet, useUpdateSet } from '@entities/set'
import { Center, Loader, Text } from '@mantine/core'
import { LibrarySettings } from '@widgets/library-settings'

type TCoverPickerModalProps = {
  packId: string
}

export const CoverPickerModal: React.FC<TCoverPickerModalProps> = ({ packId }) => {
  const { data: set, isLoading, isError } = useSet(packId)
  const updateSetMutation = useUpdateSet(packId)

  const handleSelect = async (_cards: TLibraryCard[], imports: TLibraryPictureImport[]) => {
    const imported = imports[0]

    if (!set || !imported) {
      return
    }

    await updateSetMutation.mutateAsync({
      id: set.id,
      title: set.title,
      folderId: set.folderId,
      age: set.age,
      difficulty: set.difficulty,
      goals: set.goals ?? [],
      notes: set.notes ?? null,
      coverSourcePictureId: imported.sourcePictureId,
    })
  }

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader aria-label="Загрузка набора" />
      </Center>
    )
  }

  if (isError) {
    return (
      <Center h={200}>
        <Text c="red.6">Не удалось загрузить набор</Text>
      </Center>
    )
  }

  if (!set) {
    return null
  }

  return <LibrarySettings onSelect={handleSelect} />
}
