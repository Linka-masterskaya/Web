import { CreateEntity } from '@features/create-entity'
import type { TCreateEntityConfig } from '@features/create-entity'
import { useOpenCreateSet } from '@features/create-set'
import { useSearchParams } from 'react-router'

export const DashboardCreateEntity: React.FC = () => {
  const openCreateSet = useOpenCreateSet()
  const [searchParams] = useSearchParams()
  // Пока folderId берём из query (?folderId=...), когда появится навигация по папкам.
  // Корень раздела — без folderId.
  const folderId = searchParams.get('folderId')

  const config = {
    actions: [
      {
        label: 'Новый набор',
        icon: 'Grid3x3',
        onClick: () => openCreateSet({ folderId }),
      },
      {
        label: 'Новая папка',
        link: '#',
        icon: 'Folder',
      },
    ],
  } satisfies TCreateEntityConfig

  return <CreateEntity config={config} />
}
