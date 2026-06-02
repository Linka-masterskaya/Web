import { isHTTPError } from 'ky'
import { isRouteErrorResponse } from 'react-router'

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
    if (error.response.status === 404) {
      return { title: '404 Page not found' }
    }

    return {
      title: `Error ${error.response.status}`,
      message: error.message || 'Failed to load the page.',
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
