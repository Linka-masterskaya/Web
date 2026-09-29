import { Text } from '@mantine/core'
import { Card } from '@shared/ui/card'
import { Icon } from '@shared/ui/icon'
import { useNavigate } from 'react-router'
import styles from './back-button.module.scss'

export type TBackButtonProps = {
  /** inline — иконка + текст; tile — плитка в стиле Card */
  variant?: 'inline' | 'tile'
  className?: string
  /**
   * Куда вести «назад». По умолчанию — предыдущая страница истории (navigate(-1)).
   * Передавайте `to`, если нужен гарантированный переход на конкретный маршрут.
   */
  to?: string
}

const LABEL = 'Вернуться назад'

export const BackButton: React.FC<TBackButtonProps> = ({ variant = 'inline', className, to }) => {
  const navigate = useNavigate()

  const goBack = () => {
    if (to) {
      navigate(to)
      return
    }
    navigate(-1)
  }

  // Плитка — тот же Card variant="icon", что и у соседних карточек грида: размер иконки
  // и фон иконочной области задаются стилями карточки, а не пропом size. Иначе иконка
  // не масштабируется вместе с колонкой и выглядит крупнее соседей.
  if (variant === 'tile') {
    return (
      <Card
        fill
        variant="icon"
        className={className}
        label={LABEL}
        icon={<Icon name="CornerUpLeft" aria-hidden="true" />}
        action={to ? { type: 'link', href: to } : { type: 'function', onClick: goBack }}
      />
    )
  }

  return (
    <button type="button" className={styles.inline} onClick={goBack}>
      <Icon name="CornerUpLeft" size={24} />
      <Text fz={16} fw={600}>
        {LABEL}
      </Text>
    </button>
  )
}
