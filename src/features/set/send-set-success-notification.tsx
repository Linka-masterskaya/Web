import { Text } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { useEffect } from 'react'
import styles from './send-set-success-notification.module.scss'

const SUCCESS_NOTIFICATION_DURATION_MS = 3_500

export const SendSetSuccessNotification: React.FC = () => {
  const { close } = useModal()

  useEffect(() => {
    const timeoutId = window.setTimeout(close, SUCCESS_NOTIFICATION_DURATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [close])

  return (
    <section className={styles.notification} role="status" aria-live="polite">
      <Text className={styles.text}>Набор был успешно отправлен ученику.</Text>
    </section>
  )
}
