import { ErrorFallbackUi } from '@shared/ui/error-fallback'
import type { TErrorFallbackProps } from './types'

export const ErrorFallback: React.FC<TErrorFallbackProps> = ({ onReset }) => (
  <ErrorFallbackUi
    title="Something went wrong"
    message="An unexpected error occurred. Please try again."
    onReset={onReset}
  />
)
