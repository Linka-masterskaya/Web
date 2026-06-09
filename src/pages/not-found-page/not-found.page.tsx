import { getIsAuth } from '@entities/auth'
import { Flex } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { ErrorFallbackUi } from '@shared/ui/error-fallback'
import { useNavigate } from 'react-router'
import styles from './not-found-page.module.scss'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Flex className={styles.page} align="center" justify="center">
      <ErrorFallbackUi
        title="404 Page not found"
        message="The page you are looking for does not exist."
        onReset={() => navigate(createUrl(getIsAuth() ? routerPath.dashboard : routerPath.auth))}
      />
    </Flex>
  )
}
