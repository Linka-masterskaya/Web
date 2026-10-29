import { getYandexLoginUrl } from '@entities/auth'
import { Button } from '@mantine/core'
import styles from './yandex-login-button.module.scss'

export const YandexLoginButton = () => {
  return (
    <Button component="a" href={getYandexLoginUrl()} fullWidth className={styles.button}>
      Войти с Яндекс ID
    </Button>
  )
}
