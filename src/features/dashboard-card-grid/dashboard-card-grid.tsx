import gridStyles from '@shared/styles/stretch-card-grid.module.scss'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import { dashboardCardGridItems } from './config'

export const DashboardCardGrid: React.FC = () => (
  <section className={gridStyles.grid} aria-label="Разделы дашборда">
    {dashboardCardGridItems.map((item) => (
      <Card
        key={item.id}
        fill
        className={gridStyles.card}
        variant="icon"
        label={item.label}
        icon={<Icon name={item.iconName} aria-hidden="true" />}
        action={{ type: 'link', href: item.href }}
      />
    ))}
  </section>
)
