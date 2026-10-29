import { isHTTPError } from 'ky'
import { isRouteErrorResponse } from 'react-router'

type TApiErrorBody = {
  error?: {
    message?: unknown
  }
}

const getHttpErrorDataMessage = (data: unknown): string | undefined => {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data
  }

  if (!data || typeof data !== 'object') {
    return undefined
  }

  const message = (data as TApiErrorBody).error?.message

  return typeof message === 'string' && message.length > 0 ? message : undefined
}

export const getApiErrorMessage = (error: unknown): string | undefined => {
  if (!isHTTPError(error)) {
    return undefined
  }

  return getHttpErrorDataMessage(error.data)
}

export const getErrorContent = (error: unknown): { title: string; message?: string } => {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return { title: '404 Page not found' }
    }

    return {
      title: `Error ${error.status}`,
      message: error.statusText || 'Failed to load the page.',
    }
  }

  if (isHTTPError(error)) {
    const serverMessage = getApiErrorMessage(error)

    if (error.response.status === 404) {
      return { title: '404 Page not found', ...(serverMessage && { message: serverMessage }) }
    }

    return {
      title: `Error ${error.response.status}`,
      message: serverMessage || error.message || 'Failed to load the page.',
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Something went wrong',
      message: 'An unexpected error occurred.',
    }
  }

  return {
    title: 'Something went wrong',
    message: 'An unexpected error occurred.',
  }
}
