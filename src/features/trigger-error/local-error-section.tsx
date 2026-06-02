import { ErrorBoundary } from '@app/providers/error-boundary'
import { Button } from '@mantine/core'
import { ErrorFallbackUi } from '@shared/ui/error-fallback'
import { useState } from 'react'
import { LocalErrorTrigger } from './local-error-trigger'

export const LocalErrorSection: React.FC = () => {
  const [shouldThrowLocal, setShouldThrowLocal] = useState(false)

  const handleResetLocal = (): void => {
    setShouldThrowLocal(false)
  }

  return (
    <ErrorBoundary
      fallback={({ onReset }) => (
        <ErrorFallbackUi
          title="Local block error"
          message="This error is handled by local boundary."
          onReset={() => {
            handleResetLocal()
            onReset()
          }}
        />
      )}
    >
      <Button color="red" variant="outline" onClick={() => setShouldThrowLocal(true)}>
        Trigger local error
      </Button>

      <LocalErrorTrigger shouldThrow={shouldThrowLocal} />
    </ErrorBoundary>
  )
}
