import { ActionIcon, Flex, Stack, Title } from '@mantine/core'
import { Icon } from '@shared/ui/icon'
import type { TPopupLayoutProps } from './types'

export const PopupLayout: React.FC<TPopupLayoutProps> = ({
  onClose,
  title,
  children,
  contentGap = 'md',
}) => (
  <Flex direction="column" gap={contentGap}>
    {(title || onClose) && (
      <Stack gap={0}>
        {onClose && (
          <Flex justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={onClose} aria-label="Закрыть">
              <Icon name="X" size={24} />
            </ActionIcon>
          </Flex>
        )}
        {title && (
          <Title order={2} ta="center">
            {title}
          </Title>
        )}
      </Stack>
    )}
    {children}
  </Flex>
)
