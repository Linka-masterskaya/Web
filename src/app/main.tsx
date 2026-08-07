import '@mantine/core/styles.css'
import { Router } from '@app/providers/router'
import { ThemeProvider } from '@app/providers/theme'
import { useAuthStore } from '@entities/auth'
import { setApiAccessTokenProvider } from '@shared/lib/api'
import { ErrorBoundary } from '@shared/lib/error'
import { QueryProvider } from '@shared/lib/query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

setApiAccessTokenProvider(() => useAuthStore.getState().accessToken)

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
