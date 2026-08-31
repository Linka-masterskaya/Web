import { Button } from '@mantine/core'
import { Icon } from '@shared/ui/icon'

/** Кнопка «+ Создать» в панели полки ученика */
export const CreateSetButton: React.FC = () => (
  <Button leftSection={<Icon name="Plus" size={16} />}>Создать</Button>
)
