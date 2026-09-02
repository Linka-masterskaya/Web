import { SectionContentsBrowser } from '@features/section-contents-browser'
import { Title } from '@mantine/core'
import styles from './library-page.module.scss'

export const LibraryPage: React.FC = () => (
  <section className={styles.page}>
    <Title order={1} ta="left" className={styles.title}>
      Библиотека
    </Title>
    <SectionContentsBrowser section="library" />
  </section>
)
