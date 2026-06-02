import { Code, Title } from '@mantine/core'
import { env } from '@shared/lib/env'

export const EnvVariables: React.FC = () => (
  <>
    <Title order={2} c="green" mt="md">
      Environment variables
    </Title>

    <Code color="var(--mantine-color-gray-light)">VITE_API_DOMAIN: {env.apiDomain()}</Code>

    <Code color="var(--mantine-color-gray-light)">VITE_TEST_NUMBER: {env.testNumber()}</Code>

    <Code color="var(--mantine-color-gray-light)">
      VITE_TEST_BOOLEAN: {String(env.testBoolean())}
    </Code>

    <Code color="var(--mantine-color-gray-light)">
      VITE_TEST_UNDEFINED: {env.testUndefined() ?? 'undefined'}
    </Code>
  </>
)
