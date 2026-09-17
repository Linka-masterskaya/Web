import type { TContextMenuItem } from '@shared/ui/context-menu'

type TLibraryContextMenuConfigParams<TItem extends object> = {
  onCopyIntoMy: (item: TItem) => void
  onCopyIntoStudentFolder: (item: TItem) => void
}

export const createLibraryContextMenuConfig = <TItem extends object>({
  onCopyIntoMy,
  onCopyIntoStudentFolder,
}: TLibraryContextMenuConfigParams<TItem>): TContextMenuItem<TItem>[] => [
  {
    id: 'copy-into-my',
    label: 'Копировать в Мои наборы',
    onClick: onCopyIntoMy,
  },
  {
    id: 'copy-into-student-folder',
    label: 'Копировать в папку ученика',
    onClick: onCopyIntoStudentFolder,
  },
]
