import { ActionIcon, Flex, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import type { TPopupLayoutProps } from './types'

export const PopupLayout: React.FC<TPopupLayoutProps> = ({ onClose, title, children }) => (
  <Flex direction="column" gap="md">
    {(title || onClose) && (
      <Flex justify="space-between" align="center" gap="sm">
        {title && <Title order={2}>{title}</Title>}
        {onClose && (
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={onClose}
            aria-label="Закрыть"
            ml="auto"
          >
            <Icon name="X" size={24} />
          </ActionIcon>
        )}
      </Flex>
    )}
    {children}
  </Flex>
)
