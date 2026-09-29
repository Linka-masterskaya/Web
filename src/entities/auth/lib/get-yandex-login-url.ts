import { env } from '@shared/lib/env'

export const getYandexLoginUrl = (): string => {
  const base = env.apiDomain().replace(/\/$/, '')
  return `${base}/auth/yandex/login`
}
