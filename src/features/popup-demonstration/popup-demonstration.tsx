import { Button, Flex, Image, Title } from '@mantine/core'
import { useModal } from '@shared/lib/modal'

const PREVIEW_IMAGE_URL =
  'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp'

export const PopupDemonstration: React.FC = () => {
  const { open, close } = useModal()

  const popupContent = (
    <Flex direction="column" align="center" gap="md">
      <Image src={PREVIEW_IMAGE_URL} alt="" fit="contain" radius="md" />
      <Button variant="outline" color="red" onClick={close}>
        Close
      </Button>
    </Flex>
  )

  const handleOpen = () => {
    open({
      title: 'Popup title',
      size: 'md',
      content: popupContent,
      transitionProps: { transition: 'slide-up' },
    })
  }

  return (
    <>
      <Title order={2} c="green" mt="md">
        Popup
      </Title>

      <Button variant="outline" onClick={handleOpen}>
        Open popup
      </Button>
    </>
  )
}
