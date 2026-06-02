import { ErrorFallbackUi } from './error-fallback-ui'

type TErrorFallbackDefaultProps = {
  onReset: () => void
}

export const ErrorFallbackDefault: React.FC<TErrorFallbackDefaultProps> = ({ onReset }) => (
  <ErrorFallbackUi
    title="Something went wrong"
    message="An unexpected error occurred. Please try again."
    onReset={onReset}
  />
)
