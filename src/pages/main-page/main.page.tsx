import { EnvVariables } from '@features/env-variables'
import { PopupDemonstration } from '@features/popup-demonstration'
import { TriggerErrorSection } from '@features/trigger-error'
import { Button, Flex, Group, Text } from '@mantine/core'
import { DashboardLayout } from '@widgets/dashboard-layout'

export const MainPage: React.FC = () => (
  <Flex direction="column" align="flex-start" gap="md">
    <DashboardLayout
      breadcrumbsSlot={
        <Group gap="8px">
          <Text size="14px" c="dimmed" fw={400}>
            Главная
          </Text>
          <Text size="sm" c="dimmed">
            &gt;
          </Text>
          <Text size="14px" fw={600}>
            Мои наборы
          </Text>
        </Group>
      }
      actionsSlot={<Button>+ Создать</Button>}
    >
      <Text>Страница в разработке</Text>
    </DashboardLayout>

    <TriggerErrorSection />

    <EnvVariables />

    <PopupDemonstration />
  </Flex>
)
