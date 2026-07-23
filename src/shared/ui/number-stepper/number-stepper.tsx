import { ActionIcon, Fieldset } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import styles from './number-stepper.module.scss'
import type { TNumberStepperProps } from './types'

const BUTTON_SIZE = 24
const ICON_SIZE = 20

export const NumberStepper: React.FC<TNumberStepperProps> = ({
  value,
  onChange,
  min,
  max,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const isDecrementDisabled = value <= min
  const isIncrementDisabled = value >= max

  const handleDecrement = () => {
    if (!isDecrementDisabled) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (!isIncrementDisabled) {
      onChange(value + 1)
    }
  }

  return (
    <Fieldset
      variant="unstyled"
      className={styles.stepper}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <ActionIcon
        variant="transparent"
        size={BUTTON_SIZE}
        className={styles.button}
        onClick={handleDecrement}
        aria-disabled={isDecrementDisabled}
        aria-label="Уменьшить значение"
      >
        <Icon name="Minus" size={ICON_SIZE} />
      </ActionIcon>

      <span className={styles.value} aria-live="polite">
        {value}
      </span>

      <ActionIcon
        variant="transparent"
        size={BUTTON_SIZE}
        className={styles.button}
        onClick={handleIncrement}
        aria-disabled={isIncrementDisabled}
        aria-label="Увеличить значение"
      >
        <Icon name="Plus" size={ICON_SIZE} />
      </ActionIcon>
    </Fieldset>
  )
}
