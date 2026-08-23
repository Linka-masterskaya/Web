import { CreateEntity } from '@features/create-entity'
import type { TCreateEntityConfig } from '@features/create-entity'

const dashboardCreateEntityConfig = {
  actions: [
    {
      label: 'Новый набор',
      icon: 'Grid3x3',
      onClick: () => console.log('new pack'),
    },
    {
      label: 'Новая папка',
      link: '#',
      icon: 'Folder',
    },
  ],
} satisfies TCreateEntityConfig

export const DashboardCreateEntity: React.FC = () => (
  <CreateEntity config={dashboardCreateEntityConfig} />
)
