import { env } from '@shared/lib/env'
import ky from 'ky'

const normalizeBaseUrl = (domain: string): string => {
  const trimmed = domain.replace(/\/$/, '')

  return `${trimmed}/`
}

export const apiClient = ky.create({
  baseUrl: normalizeBaseUrl(env.apiDomain()),
})
