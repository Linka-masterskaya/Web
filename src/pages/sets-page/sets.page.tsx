import { SectionContentsBrowser } from '@features/section-contents-browser'
import { Title } from '@mantine/core'
import styles from './sets-page.module.scss'

export const SetsPage: React.FC = () => {
  return (
    <section className={styles.page}>
      <Title order={2}>Мои наборы</Title>
      <SectionContentsBrowser section="my" />
    </section>
  )
}
