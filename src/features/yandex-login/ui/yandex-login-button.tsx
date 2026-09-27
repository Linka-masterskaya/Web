import { getYandexLoginUrl } from '@entities/auth'
import { Button } from '@mantine/core'

export const YandexLoginButton = () => {
  return (
    <Button component="a" href={getYandexLoginUrl()} variant="outline" fullWidth>
      Войти через Яндекс
    </Button>
  )
}
