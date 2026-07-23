// TODO: временно для отладки #68 - удалить при интеграции задач 67 и 68.

import { Button, Group, Stack, Text } from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { StudentEditor } from '@widgets/student-editor'

export const StudentsPage = () => {
  const { open, close } = useModal()

  const handleOpenCreate = () => {
    open({
      withCloseButton: false,
      content: (
        <StudentEditor
          mode="create"
          onSubmit={async (values) => {
            await console.log('Сохранение данных нового ученика:', values)
          }}
          onClose={close}
        />
      ),
    })
  }

  const handleOpenEdit = () => {
    open({
      withCloseButton: false,
      content: (
        <StudentEditor
          mode="edit"
          onSubmit={async (values) => {
            await console.log('Сохранение данных ученика:', values)
          }}
          onClose={close}
        />
      ),
    })
  }

  return (
    <Stack>
      <Text c="dimmed">Временная страница для отладки #68</Text>
      <Group>
        <Button onClick={handleOpenCreate}>Создать ученика</Button>
        <Button variant="default" onClick={handleOpenEdit}>
          Редактировать профиль
        </Button>
      </Group>
    </Stack>
  )
}
