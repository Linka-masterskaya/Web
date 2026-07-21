/**
 * Категория, выбираемая при первом открытии окна.
 * null — использовать первую категорию из списка.
 */
export const LIBRARY_DEFAULT_CATEGORY_ID: number | null = null

export const LIBRARY_STALE_TIME_MS = 60_000
export const LIBRARY_GC_TIME_MS = LIBRARY_STALE_TIME_MS * 5

/** Минимальная длина запроса, с которой начинается поиск по библиотеке */
export const LIBRARY_SEARCH_MIN_QUERY_LENGTH = 2

/** Максимум результатов поиска — контракт limit для будущего backend API */
export const LIBRARY_SEARCH_RESULTS_LIMIT = 10
