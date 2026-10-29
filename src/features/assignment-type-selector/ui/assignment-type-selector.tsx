import { Radio, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import type { TAssignmentTypeSelectorProps } from '../model/types'
import styles from './assignment-type-selector.module.scss'

export const AssignmentTypeSelector: React.FC<TAssignmentTypeSelectorProps> = ({
  value,
  options,
  onChange,
  disabled = false,
  compact = false,
}) => {
  const handleChange = (nextValue: string) => {
    if (!disabled) {
      onChange(nextValue)
    }
  }

  return (
    <Radio.Group
      value={value}
      onChange={handleChange}
      aria-label="Выбор типа задания"
      aria-busy={disabled}
      className={styles.container}
      data-compact={compact ? 'true' : 'false'}
    >
      <div className={styles.options}>
        {options.map((option) => (
          <Radio.Card
            key={option.id}
            value={option.id}
            className={styles.option}
            disabled={disabled}
            aria-label={compact ? option.title : undefined}
            data-compact={compact ? 'true' : 'false'}
          >
            <div className={styles.optionContent}>
              <Icon name={option.iconName} aria-hidden />
              <Text className={styles.optionTitle}>{option.title}</Text>
            </div>
          </Radio.Card>
        ))}
      </div>
    </Radio.Group>
  )
}
