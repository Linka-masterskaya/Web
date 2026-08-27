import { Stack, Text } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { BackButton } from '@shared/ui/back-button'

export const StudentShelfPage: React.FC = () => (
  <Stack align="flex-start" gap="lg">
    {/* Назад = список учеников (явный маршрут надёжнее navigate(-1)) */}
    <BackButton variant="tile" to={createUrl(routerPath.dashboardStudents)} />
    <Text c="dimmed">Страница в разработке</Text>
  </Stack>
)
