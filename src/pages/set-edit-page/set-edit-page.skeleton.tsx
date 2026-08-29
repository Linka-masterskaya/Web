import { Center, Loader } from '@mantine/core'

export const SetEditPageSkeleton = () => (
  <Center h="100%" mih={240}>
    <Loader aria-label="Загрузка редактора" />
  </Center>
)
