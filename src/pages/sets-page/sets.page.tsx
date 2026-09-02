import { SectionContentsBrowser } from '@features/section-contents-browser'
import { Title } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { useNavigate } from 'react-router'
import styles from './sets-page.module.scss'

export const SetsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className={styles.page}>
      <Title order={1} ta="left" className={styles.title}>
        Мои наборы
      </Title>
      <SectionContentsBrowser
        section="my"
        dashboardHref={createUrl(routerPath.dashboard)}
        onOpenPack={(pack) => {
          navigate(createUrl(routerPath.dashboardSetId, { setId: pack.id }))
        }}
      />
    </section>
  )
}
