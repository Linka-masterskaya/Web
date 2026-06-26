import { ActionIcon, Group } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import {
  type TViewMode,
  type TViewModeOption,
  VIEW_MODE_OPTIONS,
  VIEW_QUERY_PARAM_KEY,
} from '../config'

type TViewToggleProps = {
  defaultView?: TViewMode
}

export const ViewToggle: React.FC<TViewToggleProps> = ({ defaultView = 'list' }) => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const current: TViewMode =
    queryParams[VIEW_QUERY_PARAM_KEY] === 'list' || queryParams[VIEW_QUERY_PARAM_KEY] === 'grid'
      ? queryParams[VIEW_QUERY_PARAM_KEY]
      : defaultView

  const handleSelect = (option: TViewModeOption) => {
    setQueryParams(
      { [VIEW_QUERY_PARAM_KEY]: option.id === defaultView ? null : option.id },
      false,
      { replace: true },
    )
    option.onSelect?.()
  }

  return (
    <Group gap={4} role="radiogroup" aria-label="Режим отображения">
      {VIEW_MODE_OPTIONS.map((option) => (
        <ActionIcon
          key={option.id}
          variant="transparent"
          role="radio"
          aria-checked={current === option.id}
          aria-label={option.label}
          onClick={() => handleSelect(option)}
        >
          <Icon
            name={option.icon}
            size={20}
            color={
              current === option.id ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)'
            }
          />
        </ActionIcon>
      ))}
    </Group>
  )
}
