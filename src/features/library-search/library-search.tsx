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

  // Enter нажат раньше, чем debounce/запрос вернули результаты — сабмит откладывается
  const [isSubmitPending, setIsSubmitPending] = useState(false)

  // После onOptionSubmit Autocomplete сам вызывает onChange с текстом выбранной опции,
  // поэтому очистить строку внутри onOptionSubmit нельзя — флаг откладывает очистку
  // до этого onChange (см. handleChange)
  const shouldClearRef = useRef(false)

  const { data: foundCards = [] } = useLibraryCardSearch(debouncedValue)

  // Autocomplete работает со строками, поэтому дублирующиеся названия схлопываем.
  // Если появятся одинаковые title в разных категориях — перейти на Combobox с value = card.id.
  const options = [...new Set(foundCards.map((card) => card.title))]

  // Лучшее совпадение по введённой строке: точное название, иначе первый подходящий результат
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

    // Отложенная очистка после выбора опции: игнорируем подставленный текст опции
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

  // Enter — поиск по введённому слову, не дожидаясь выбора подсказки из списка
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // defaultPrevented — Enter уже обработан комбобоксом как выбор подсвеченной опции
    if (event.key !== 'Enter' || event.defaultPrevented) {
      return
    }

    const card = findBestMatch(value)

    if (card) {
      setIsSubmitPending(false)
      setValue('')
      onSelect(card)
      return
    }

    setIsSubmitPending(true)
  }

  // Отложенный сабмит: выполняем, когда пришли результаты для текущего запроса
  useEffect(() => {
    if (!isSubmitPending) {
      return
    }

    const card = findBestMatch(value)

    if (card) {
      setIsSubmitPending(false)
      setValue('')
      onSelect(card)
      return
    }

    // Запрос завершён, совпадений нет — снимаем отложенный сабмит
    if (debouncedValue === value) {
      setIsSubmitPending(false)
    }
  }, [isSubmitPending, findBestMatch, value, debouncedValue, onSelect])

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
