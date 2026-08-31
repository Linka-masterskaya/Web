import type { TLibraryCard } from '@entities/library'
import type { TContextMenuItem } from '@shared/ui/context-menu'

type TContextMenuItemLibrary = {
  onCopyIntoMy: (item: TLibraryCard) => void
  onCopyIntoStudentFolder: (item: TLibraryCard) => void
}

export const createLibraryContextMenuConfig = ({
  onCopyIntoMy,
  onCopyIntoStudentFolder,
}: TContextMenuItemLibrary): TContextMenuItem<TLibraryCard>[] => [
  {
    id: 'copy-into-my',
    label: 'Копировать в Мои наборы',
    onClick: (item) => {
      onCopyIntoMy(item)
    },
  },
  {
    id: 'copy-into-student-folder',
    label: 'Копировать в папку ученика',
    onClick: (item) => {
      onCopyIntoStudentFolder(item)
    },
  },
]
