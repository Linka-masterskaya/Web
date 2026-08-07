import { Group, Radio, Stack, Text } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import type { TAssignmentTypeSelectorProps } from '../model/types'
import styles from './assignment-type-selector.module.scss'

export const AssignmentTypeSelector: React.FC<TAssignmentTypeSelectorProps> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      aria-label="Выбор типа задания"
      className={styles.container}
    >
      <Stack gap="8px">
        {options.map((option) => (
          <Radio.Card
            key={option.id}
            value={option.id}
            radius="8px"
            className={styles.option}
            c="blue.4"
          >
            <Group gap="8px" wrap="nowrap">
              <Icon name={option.iconName} aria-hidden />
              <Text>{option.title}</Text>
            </Group>
          </Radio.Card>
        ))}
      </Stack>
    </Radio.Group>
  )
}
