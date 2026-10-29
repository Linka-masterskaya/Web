import { getErrorContent } from '@shared/lib/error'
import { createUrl, routerPath } from '@shared/lib/routes'
import { ErrorFallbackUi } from '@shared/ui/error-fallback'
import { useNavigate, useRouteError } from 'react-router'

export const RouteErrorFallback: React.FC = () => {
  const error = useRouteError()
  const navigate = useNavigate()
  const { title, message } = getErrorContent(error)

  return (
    <ErrorFallbackUi
      title={title}
      message={message}
      onReset={() => navigate(createUrl(routerPath.dashboard))}
    />
  )
}
