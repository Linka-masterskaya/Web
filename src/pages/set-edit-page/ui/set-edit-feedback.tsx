import { Text } from '@mantine/core'
import type { ReactNode } from 'react'
import styles from '../set-edit-page.module.scss'

type TSetEditFeedbackProps = {
  children?: ReactNode
  description?: string
  isError?: boolean
  message: string
}

export const SetEditFeedback: React.FC<TSetEditFeedbackProps> = ({
  children,
  description,
  isError = false,
  message,
}) => (
  <div className={styles.feedback}>
    <div className={styles.feedbackContent}>
      <Text
        className={isError ? styles.feedbackError : styles.feedbackTitle}
        role={isError ? 'alert' : undefined}
      >
        {message}
      </Text>
      {description && <Text className={styles.feedbackDescription}>{description}</Text>}
      {children}
    </div>
  </div>
)
