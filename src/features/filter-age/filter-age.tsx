import { Select } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useState } from 'react'
import { FILTER_AGE_OPTIONS } from './config'
import styles from './filter-age.module.scss'

export const FilterAge: React.FC = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const [value, setValue] = useState<string | null>(() => {
    const urlValue = queryParams.age
    if (urlValue === null) return null
    return FILTER_AGE_OPTIONS.some((opt) => opt.value === urlValue) ? urlValue : null
  })

  const handleChange = (newValue: string | null) => {
    setValue(newValue)
    setQueryParams({ age: newValue })
  }

  return (
    <Select
      placeholder="Возраст"
      data={FILTER_AGE_OPTIONS}
      value={value}
      onChange={handleChange}
      clearable
      withCheckIcon={false}
      rightSection={<Icon name="ChevronDown" size={16} />}
      classNames={{ input: styles.input }}
    />
  )
}
