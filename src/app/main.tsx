import '@mantine/core/styles.css'
import { ErrorBoundary } from '@app/providers/error-boundary'
import { Router } from '@app/providers/router'
import { ThemeProvider } from '@app/providers/theme'
import { QueryProvider } from '@shared/lib/query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
