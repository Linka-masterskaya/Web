import { Button, Flex, Text, Title } from '@mantine/core'
import type { TErrorFallbackUiProps } from './types'

export const ErrorFallbackUi: React.FC<TErrorFallbackUiProps> = ({ title, message, onReset }) => (
  <Flex direction="column" align="center" justify="center" role="alert" gap="md" mt="xl">
    <Title>{title}</Title>
    {message ? <Text>{message}</Text> : null}
    <Button type="button" onClick={onReset}>
      Try again
    </Button>
  </Flex>
)
