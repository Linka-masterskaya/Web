import { Text } from '@mantine/core'
import styles from './email-verification-notice.module.scss'

export const EmailVerificationNotice = () => (
  <section className={styles.notice} aria-label="Подтверждение email">
    <Text className={styles.text}>
      Для использования Linka Editor, пожалуйста, подтвердите свой email. Письмо с активацией в
      вашем почтовом ящике.
    </Text>
  </section>
)
