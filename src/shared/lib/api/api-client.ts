import { env } from '@shared/lib/env'
import ky, { HTTPError } from 'ky'

type TAccessTokenProvider = () => string | null
type TAccessTokenUpdateHandler = (accessToken: string) => void
type TAuthFailureHandler = () => void

let accessTokenProvider: TAccessTokenProvider = () => null
let accessTokenUpdateHandler: TAccessTokenUpdateHandler = () => undefined
let authFailureHandler: TAuthFailureHandler = () => undefined
let refreshingPromise: Promise<string> | null = null
let failedRefresh: { accessToken: string | null; error: unknown } | null = null

const normalizeBaseUrl = (domain: string): string => {
  const trimmed = domain.replace(/\/$/, '')

  return `${trimmed}/`
}

export const setApiAccessTokenProvider = (provider: TAccessTokenProvider): void => {
  accessTokenProvider = provider
}

export const setApiAccessTokenUpdateHandler = (handler: TAccessTokenUpdateHandler): void => {
  accessTokenUpdateHandler = handler
}

export const setApiAuthFailureHandler = (handler: TAuthFailureHandler): void => {
  authFailureHandler = handler
}

const refreshClient = ky.create({
  baseUrl: normalizeBaseUrl(env.apiDomain()),
  credentials: 'include',
})

const refreshAccessToken = async (): Promise<string> => {
  const response = await refreshClient.post('auth/refresh').json<unknown>()

  if (
    typeof response !== 'object' ||
    response === null ||
    !('access_token' in response) ||
    typeof response.access_token !== 'string' ||
    response.access_token.length === 0
  ) {
    throw new Error('Refresh endpoint returned an invalid access token')
  }

  return response.access_token
}

const getAccessTokenFromAuthorization = (authorization: string | null): string | null => {
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length)
}

const getNewAccessToken = (failedAccessToken: string | null): Promise<string> => {
  if (refreshingPromise) {
    return refreshingPromise
  }

  if (failedRefresh?.accessToken === failedAccessToken) {
    return Promise.reject(failedRefresh.error)
  }

  if (!refreshingPromise) {
    refreshingPromise = refreshAccessToken()
      .then((accessToken) => {
        failedRefresh = null
        accessTokenUpdateHandler(accessToken)

        return accessToken
      })
      .catch((error: unknown) => {
        failedRefresh = { accessToken: failedAccessToken, error }
        authFailureHandler()
        throw error
      })
      .finally(() => {
        refreshingPromise = null
      })
  }

  return refreshingPromise
}

export const apiClient = ky.create({
  baseUrl: normalizeBaseUrl(env.apiDomain()),
  credentials: 'include',
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = accessTokenProvider()

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        }
      },
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (!(error instanceof HTTPError) || error.response.status !== 401) {
          return
        }

        const failedAccessToken = getAccessTokenFromAuthorization(
          request.headers.get('Authorization'),
        )
        const currentAccessToken = accessTokenProvider()

        if (currentAccessToken && currentAccessToken !== failedAccessToken) {
          request.headers.set('Authorization', `Bearer ${currentAccessToken}`)
          return
        }

        const accessToken = await getNewAccessToken(failedAccessToken)

        request.headers.set('Authorization', `Bearer ${accessToken}`)
      },
    ],
  },
  retry: {
    limit: 1,
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    statusCodes: [401],
  },
})
