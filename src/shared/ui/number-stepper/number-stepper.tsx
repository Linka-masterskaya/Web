import { ActionIcon, Box, Input } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import { useId } from 'react'
import styles from './number-stepper.module.scss'
import type { TNumberStepperProps } from './types'

const BUTTON_SIZE = 24
const ICON_SIZE = 20

export const NumberStepper: React.FC<TNumberStepperProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const generatedLabelId = useId()
  const labelId = label ? generatedLabelId : undefined

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
    <Box className={styles.wrapper}>
      {label ? (
        <Input.Label id={labelId} className={styles.label}>
          {label}
        </Input.Label>
      ) : null}

      <Box
        role="group"
        className={styles.stepper}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : ariaLabelledBy}
      >
        <ActionIcon
          variant="transparent"
          size={BUTTON_SIZE}
          className={styles.button}
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
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
          disabled={isIncrementDisabled}
          aria-label="Увеличить значение"
        >
          <Icon name="Plus" size={ICON_SIZE} />
        </ActionIcon>
      </Box>
    </Box>
  )
}
