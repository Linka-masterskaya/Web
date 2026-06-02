import { DEFAULT_PRODUCTS_LIMIT, PRODUCTS_LIMIT_OPTIONS } from '../config'

export const getProductsLimit = (perPage: string | null): number => {
  if (!perPage) {
    return DEFAULT_PRODUCTS_LIMIT
  }

  const parsedLimit = Number(perPage)

  if (
    Number.isNaN(parsedLimit) ||
    !PRODUCTS_LIMIT_OPTIONS.includes(parsedLimit as (typeof PRODUCTS_LIMIT_OPTIONS)[number])
  ) {
    return DEFAULT_PRODUCTS_LIMIT
  }

  return parsedLimit
}
