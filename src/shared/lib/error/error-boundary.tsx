import { ErrorFallbackDefault } from '@shared/ui/error-fallback'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import type { TErrorBoundaryProps, TErrorBoundaryState } from './types'

export class ErrorBoundary extends Component<TErrorBoundaryProps, TErrorBoundaryState> {
  state: TErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): TErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
    if (import.meta.env.DEV) {
      // biome-ignore lint/suspicious/noConsole: ErrorBoundary должен выводить ошибки в консоль в dev-режиме для отладки
      console.error('[ErrorBoundary] Caught error during render:', error, {
        name: error.name,
        message: error.message,
        cause: error.cause,
        componentStack: errorInfo.componentStack,
      })
    }
  }

  handleReset = (): void => {
    window.location.reload()
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({ onReset: this.resetErrorBoundary })
      }

      return this.props.fallback ?? <ErrorFallbackDefault onReset={this.handleReset} />
    }

    return this.props.children
  }
}
