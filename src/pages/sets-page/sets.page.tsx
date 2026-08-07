import { useOpenMoveSet } from '@features/move-set'
import { Button, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'

export const SetsPage: React.FC = () => {
  const openMoveSet = useOpenMoveSet()
  const [isMoveSuccessful, setIsMoveSuccessful] = useState(false)

  const handleOpenMoveSet = () => {
    setIsMoveSuccessful(false)
    openMoveSet({
      setId: 'demo-set',
      onSuccess: () => setIsMoveSuccessful(true),
    })
  }

  return (
    <section>
      <Stack align="flex-start" gap="md">
        <Title order={2}>Мои наборы</Title>
        <Text c="dimmed">Временный стенд для проверки перемещения набора.</Text>
        <Button onClick={handleOpenMoveSet}>Переместить набор</Button>
        {isMoveSuccessful && <Text c="green.7">Набор успешно перемещён</Text>}
      </Stack>
    </section>
  )
}
