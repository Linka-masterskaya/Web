import { EnvVariables } from '@features/env-variables'
import { PopupDemonstration } from '@features/popup-demonstration'
import { TriggerErrorSection } from '@features/trigger-error'
import { Flex, Title } from '@mantine/core'

export const MainPage: React.FC = () => (
  <Flex direction="column" align="flex-start" gap="md">
    <Title>Main Dashboard</Title>

    <TriggerErrorSection />
    <EnvVariables />
    <PopupDemonstration />
  </Flex>
)
