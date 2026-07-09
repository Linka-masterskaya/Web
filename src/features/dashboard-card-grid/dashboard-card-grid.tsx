import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import { dashboardCardGridItems } from './config'
import styles from './dashboard-card-grid.module.scss'

export const DashboardCardGrid: React.FC = () => (
  <section className={styles.grid} aria-label="Разделы дашборда">
    {dashboardCardGridItems.map((item) => (
      <Card
        key={item.id}
        className={styles.card}
        variant="icon"
        label={item.label}
        icon={<Icon name={item.iconName} aria-hidden="true" />}
        action={{ type: 'link', href: item.href }}
      />
    ))}
  </section>
)
