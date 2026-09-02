import { Autocomplete } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useState } from 'react'
import { FILTER_SEARCH_DEBOUNCE_DELAY } from './config'

export type TFilterSearchProps = {
  data?: string[]
}

export const FilterSearch: React.FC<TFilterSearchProps> = ({ data = [] }) => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const [value, setValue] = useState(() => queryParams.search ?? '')

  const updateSearchParam = useDebouncedCallback(
    (search: string) => {
      setQueryParams({ search: search || null })
    },
    { delay: FILTER_SEARCH_DEBOUNCE_DELAY, flushOnUnmount: true },
  )

  const handleChange = (newValue: string) => {
    setValue(newValue)
    updateSearchParam(newValue)
  }

  const filteredData = data.filter((item) =>
    item.toLowerCase().startsWith(value.trim().toLowerCase()),
  )

  return (
    <Autocomplete
      placeholder="Поиск"
      leftSection={<Icon name="Search" size={20} />}
      data={filteredData}
      value={value}
      onChange={handleChange}
      openOnFocus={false}
      clearable
    />
  )
}
