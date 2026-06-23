import { Select } from '@mantine/core'
import { useRouteQueryParams } from '@shared/lib/routes'
import { Icon } from '@shared/ui/icon'
import { useState } from 'react'
import { FILTER_LEVEL_LABELS, FILTER_LEVEL_OPTIONS, type TFilterLevel } from './config'
import styles from './filter-level.module.scss'

export const FilterLevel: React.FC = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()

  const [value, setValue] = useState<TFilterLevel | null>(() => {
    const urlValue = queryParams.level
    if (urlValue !== null && FILTER_LEVEL_OPTIONS.includes(urlValue as TFilterLevel)) {
      return urlValue as TFilterLevel
    }
    return null
  })

  const handleChange = (newValue: string | null) => {
    if (newValue === null) {
      setValue(null)
      setQueryParams({ level: null })
      return
    }
    setValue(newValue as TFilterLevel)
    setQueryParams({ level: newValue as TFilterLevel })
  }

  const data = FILTER_LEVEL_OPTIONS.map((level) => ({
    value: level,
    label: FILTER_LEVEL_LABELS[level],
  }))

  return (
    <Select
      placeholder="Уровень"
      data={data}
      value={value}
      onChange={handleChange}
      clearable
      withCheckIcon={false}
      rightSection={<Icon name="ChevronDown" size={16} />}
      classNames={{ input: styles.input }}
    />
  )
}
