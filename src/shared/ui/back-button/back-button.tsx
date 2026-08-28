import { Card, Group, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useNavigate } from 'react-router'
import styles from './back-button.module.scss'

export type TBackButtonProps = {
  /** inline — иконка + текст; tile — плитка в стиле Card */
  variant?: 'inline' | 'tile'
  /**
   * Куда вести «назад». По умолчанию — предыдущая страница истории (navigate(-1)).
   * Передавайте `to`, если нужен гарантированный переход на конкретный маршрут.
   */
  to?: string
}

export const BackButton: React.FC<TBackButtonProps> = ({ variant = 'inline', to }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
      return
    }
    navigate(-1)
  }

  if (variant === 'tile') {
    return (
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        className={styles.tile}
        onClick={handleClick}
        role="button"
      >
        <Group justify="center" className={styles.tileIconArea}>
          <Icon name="CornerUpLeft" size={72} color="var(--mantine-color-blue-4)" />
        </Group>
        <Text ta="left" fw={600} mt="sm">
          Вернуться назад
        </Text>
      </Card>
    )
  }

  return (
    <button type="button" className={styles.inline} onClick={handleClick}>
      <Icon name="CornerUpLeft" size={24} />
      <Text fz={16} fw={600}>
        Вернуться назад
      </Text>
    </button>
  )
}
