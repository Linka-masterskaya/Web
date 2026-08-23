import type { TSetPageType } from '@entities/set'
import { SET_PAGE_TYPE_OPTIONS } from '../config'

export const isSetPageType = (value: string): value is TSetPageType =>
  SET_PAGE_TYPE_OPTIONS.some((option) => option.id === value)
