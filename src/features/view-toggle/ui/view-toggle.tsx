import { ActionIcon, Group } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import type { TViewMode } from '../config'

type TViewToggleProps = {
  defaultView?: TViewMode
}

export const ViewToggle: React.FC<TViewToggleProps> = ({ defaultView = 'list' }) => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const current: TViewMode =
    queryParams.view === 'list' || queryParams.view === 'grid' ? queryParams.view : defaultView

  const handleSelect = (view: TViewMode) => {
    setQueryParams({ view: view === defaultView ? null : view }, false, { replace: true })
  }

  return (
    <Group gap={0}>
      <ActionIcon
        size="lg"
        radius="md"
        variant={current === 'list' ? 'filled' : 'default'}
        aria-label="List view"
        aria-pressed={current === 'list'}
        onClick={() => handleSelect('list')}
      >
        <Icon name="LayoutList" size={24} />
      </ActionIcon>
      <ActionIcon
        size="lg"
        radius="md"
        variant={current === 'grid' ? 'filled' : 'default'}
        aria-label="Grid view"
        aria-pressed={current === 'grid'}
        onClick={() => handleSelect('grid')}
      >
        <Icon name="LayoutGrid" size={24} />
      </ActionIcon>
    </Group>
  )
}
