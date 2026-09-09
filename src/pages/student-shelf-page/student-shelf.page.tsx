import { Blockquote, Title } from '@mantine/core'
import gridStyles from '@shared/styles/stretch-card-grid.module.scss'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import { useNavigate } from 'react-router'
import styles from './student-shelf-page.module.scss'

export const StudentShelfPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className={styles.page}>
      <Title order={1} ta="left" className={styles.title}>
        Полка ученика
      </Title>

      <section className={styles.content} aria-label="Содержимое полки">
        <Blockquote
          className={styles.emptyText}
          color="blue"
          icon={<Icon name="Info" aria-hidden="true" />}
          iconSize={32}
        >
          Страница в разработке
        </Blockquote>

        <div className={gridStyles.grid}>
          <Card
            fill
            className={gridStyles.card}
            variant="icon"
            label="Вернуться назад"
            icon={<Icon name="CornerUpLeft" aria-hidden="true" />}
            action={{
              type: 'function',
              onClick: () => navigate(-1),
            }}
          />
        </div>
      </section>
    </section>
  )
}
