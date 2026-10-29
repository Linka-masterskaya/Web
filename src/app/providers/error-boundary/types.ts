import type { ErrorInfo, ReactNode } from 'react'

export type TErrorFallbackProps = {
  onReset: () => void
}

export type TErrorBoundaryFallback = ReactNode | ((props: TErrorFallbackProps) => ReactNode)

export type TErrorBoundaryProps = {
  children: ReactNode
  fallback?: TErrorBoundaryFallback
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export type TErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}
