import { LIBRARY_SEARCH_MIN_QUERY_LENGTH, useLibraryCardSearch } from '@entities/library'
import { Autocomplete } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { Icon } from '@shared/ui/icon'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LIBRARY_SEARCH_DEBOUNCE_DELAY } from './config'
import type { TLibrarySearchProps } from './types'

export const LibrarySearch: React.FC<TLibrarySearchProps> = ({ onSelect, className }) => {
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebouncedValue(value, LIBRARY_SEARCH_DEBOUNCE_DELAY)

  const [isSubmitPending, setIsSubmitPending] = useState(false)

  const shouldClearRef = useRef(false)

  const {
    data: foundCards = [],
    isFetching,
    isPlaceholderData,
  } = useLibraryCardSearch(debouncedValue)

  const options = [...new Set(foundCards.map((card) => card.title))]

  const isSearchSettledForValue = debouncedValue === value && !isFetching && !isPlaceholderData

  const findBestMatch = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase()

      if (normalizedQuery.length < LIBRARY_SEARCH_MIN_QUERY_LENGTH) {
        return undefined
      }

      const matches = foundCards.filter((card) =>
        card.title.toLowerCase().includes(normalizedQuery),
      )

      return matches.find((card) => card.title.toLowerCase() === normalizedQuery) ?? matches[0]
    },
    [foundCards],
  )

  const handleChange = (nextValue: string) => {
    setIsSubmitPending(false)

    if (shouldClearRef.current) {
      shouldClearRef.current = false
      setValue('')
      return
    }

    setValue(nextValue)
  }

  const handleOptionSubmit = (title: string) => {
    setIsSubmitPending(false)

    const card = foundCards.find((foundCard) => foundCard.title === title)

    if (card) {
      shouldClearRef.current = true
      onSelect(card)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.defaultPrevented) {
      return
    }

    setIsSubmitPending(true)
  }

  useEffect(() => {
    if (!isSubmitPending) {
      return
    }

    if (value.trim().toLowerCase().length < LIBRARY_SEARCH_MIN_QUERY_LENGTH) {
      setIsSubmitPending(false)
      return
    }

    if (!isSearchSettledForValue) {
      return
    }

    const card = findBestMatch(value)

    if (card) {
      setValue('')
      onSelect(card)
    }

    setIsSubmitPending(false)
  }, [isSubmitPending, findBestMatch, value, isSearchSettledForValue, onSelect])

  return (
    <Autocomplete
      className={className}
      value={value}
      onChange={handleChange}
      onOptionSubmit={handleOptionSubmit}
      onKeyDown={handleKeyDown}
      data={options}
      placeholder="Поиск"
      aria-label="Поиск по библиотеке"
      leftSection={<Icon name="Search" size={20} />}
      openOnFocus={false}
      clearable
    />
  )
}
