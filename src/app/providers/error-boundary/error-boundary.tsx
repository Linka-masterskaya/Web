import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from './error-fallback'
import type { TErrorBoundaryProps, TErrorBoundaryState } from './types'

export class ErrorBoundary extends Component<TErrorBoundaryProps, TErrorBoundaryState> {
  state: TErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): TErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
    if (import.meta.env.DEV) {
      console.error(error, errorInfo)
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

      return this.props.fallback ?? <ErrorFallback onReset={this.handleReset} />
    }

    return this.props.children
  }
}
