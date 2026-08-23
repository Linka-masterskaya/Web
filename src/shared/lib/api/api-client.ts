import { env } from '@shared/lib/env'
import ky, { HTTPError } from 'ky'

type TAccessTokenProvider = () => string | null
type TAccessTokenUpdateHandler = (accessToken: string) => void
type TAuthFailureHandler = () => void

let accessTokenProvider: TAccessTokenProvider = () => null
let accessTokenUpdateHandler: TAccessTokenUpdateHandler = () => undefined
let authFailureHandler: TAuthFailureHandler = () => undefined
let refreshingPromise: Promise<string> | null = null
let failedRefresh: { accessToken: string; error: unknown } | null = null

const normalizeBaseUrl = (domain: string): string => {
  const trimmed = domain.replace(/\/$/, '')

  return `${trimmed}/`
}

const logAuthDebug = (message: string, details?: Record<string, unknown>) => {
  if (!import.meta.env.DEV) {
    return
  }

  // biome-ignore lint/suspicious/noConsole: временный лог для отладки 401/refresh
  console.warn(`[api-auth] ${message}`, details ?? {})
}

const serializeHttpError = async (error: unknown) => {
  if (!(error instanceof HTTPError)) {
    return {
      message: error instanceof Error ? error.message : String(error),
    }
  }

  let body: unknown = null

  try {
    body = await error.response.clone().json()
  } catch {
    try {
      body = await error.response.clone().text()
    } catch {
      body = null
    }
  }

  return {
    status: error.response.status,
    url: error.request.url,
    method: error.request.method,
    body,
  }
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

export const sessionApiClient = ky.create({
  baseUrl: normalizeBaseUrl(env.apiDomain()),
  credentials: 'include',
})

const refreshAccessToken = async (): Promise<string> => {
  logAuthDebug('refresh: start', {
    apiDomain: env.apiDomain(),
    hasAccessToken: Boolean(accessTokenProvider()),
  })

  try {
    const response = await sessionApiClient.post('auth/refresh').json<unknown>()

    if (
      typeof response !== 'object' ||
      response === null ||
      !('access_token' in response) ||
      typeof response.access_token !== 'string' ||
      response.access_token.length === 0
    ) {
      logAuthDebug('refresh: invalid response body', { response })
      throw new Error('Сервер вернул некорректный access token')
    }

    logAuthDebug('refresh: success')
    return response.access_token
  } catch (error: unknown) {
    logAuthDebug('refresh: failed', await serializeHttpError(error))
    throw error
  }
}

const getAccessTokenFromAuthorization = (authorization: string | null): string | null => {
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length)
}

const isInvalidRefreshTokenError = (error: unknown): error is HTTPError =>
  error instanceof HTTPError && error.response.status === 401

const getNewAccessToken = (failedAccessToken: string): Promise<string> => {
  if (refreshingPromise) {
    logAuthDebug('refresh: reuse in-flight promise')
    return refreshingPromise
  }

  if (failedRefresh?.accessToken === failedAccessToken) {
    logAuthDebug('refresh: skip, previous refresh already failed for this access token')
    return Promise.reject(failedRefresh.error)
  }

  refreshingPromise = refreshAccessToken()
    .then((accessToken) => {
      failedRefresh = null

      // За время refresh пользователь мог выйти из аккаунта
      // или войти под другим пользователем.
      if (accessTokenProvider() === failedAccessToken) {
        accessTokenUpdateHandler(accessToken)
      }

      return accessToken
    })
    .catch((error: unknown) => {
      if (isInvalidRefreshTokenError(error)) {
        failedRefresh = { accessToken: failedAccessToken, error }
        logAuthDebug('refresh: logout after 401')
        authFailureHandler()
      } else {
        // 403 и прочие статусы сейчас не разлогинивают — логируем явно
        logAuthDebug('refresh: error without logout', {
          willLogout: false,
          note: 'logout срабатывает только на HTTP 401 от refresh',
        })
      }

      throw error
    })
    .finally(() => {
      refreshingPromise = null
    })

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

        logAuthDebug('request: 401, trying refresh', {
          url: request.url,
          method: request.method,
          error: await serializeHttpError(error),
        })

        const failedAccessToken = getAccessTokenFromAuthorization(
          request.headers.get('Authorization'),
        )

        if (!failedAccessToken) {
          logAuthDebug('request: 401 without Bearer token, skip refresh')
          return
        }

        const currentAccessToken = accessTokenProvider()

        if (currentAccessToken && currentAccessToken !== failedAccessToken) {
          logAuthDebug('request: access token already rotated, retry with new token')
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
    shouldRetry: ({ error }) => {
      if (error instanceof HTTPError && error.response.status === 401) {
        return Boolean(getAccessTokenFromAuthorization(error.request.headers.get('Authorization')))
      }

      return undefined
    },
  },
})
