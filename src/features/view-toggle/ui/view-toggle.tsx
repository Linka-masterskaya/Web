import { Group } from '@mantine/core'
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
    setQueryParams({ view: view === defaultView ? null : view }, false, {
      replace: true,
    })
  }

  return (
    <Group gap={16}>
      <Icon
        name="List"
        size="24"
        radius="md"
        color={current === 'list' ? '#000' : '#888'}
        aria-label="List view"
        aria-pressed={current === 'list'}
        onClick={() => handleSelect('list')}
      />
      <Icon
        name="LayoutGrid"
        size="24"
        radius="md"
        color={current === 'grid' ? '#000' : '#888'}
        aria-label="Grid view"
        aria-pressed={current === 'grid'}
        onClick={() => handleSelect('grid')}
      />
    </Group>
  )
}
