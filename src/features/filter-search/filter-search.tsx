import { Autocomplete } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useEffect, useRef, useState } from 'react'
import { FILTER_SEARCH_DEBOUNCE_DELAY } from './config'

export type TFilterSearchProps = {
  data?: string[]
}

export const FilterSearch: React.FC<TFilterSearchProps> = ({ data = [] }) => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const [value, setValue] = useState(() => queryParams.search ?? '')
  const [debounced] = useDebouncedValue(value, FILTER_SEARCH_DEBOUNCE_DELAY)
  const isFirstRender = useRef(true)

  // Запись отложенного значения в URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setQueryParams({ search: debounced || null })
  }, [debounced, setQueryParams])

  const filteredData = data.filter((item) =>
    item.toLowerCase().startsWith(value.trim().toLowerCase()),
  )

  return (
    <Autocomplete
      placeholder="Поиск"
      leftSection={<Icon name="Search" size={20} />}
      data={filteredData}
      value={value}
      onChange={setValue}
      openOnFocus={false}
      clearable
    />
  )
}
