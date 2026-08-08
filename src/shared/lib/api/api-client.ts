import { env } from '@shared/lib/env'
import ky from 'ky'

type TAccessTokenProvider = () => string | null

let accessTokenProvider: TAccessTokenProvider = () => null

const normalizeBaseUrl = (domain: string): string => {
  const trimmed = domain.replace(/\/$/, '')

  return `${trimmed}/`
}

export const setApiAccessTokenProvider = (provider: TAccessTokenProvider): void => {
  accessTokenProvider = provider
}

export const apiClient = ky.create({
  baseUrl: normalizeBaseUrl(env.apiDomain()),
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = accessTokenProvider()

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        }
      },
    ],
  },
})
