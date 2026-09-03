import { Loader } from '@mantine/core'
import styles from './set-edit-page.module.scss'

export const SetEditPageSkeleton = () => (
  <div className={styles.skeleton}>
    <Loader aria-label="Загрузка редактора набора" />
  </div>
)
