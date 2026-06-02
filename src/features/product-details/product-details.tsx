import { useProduct } from '@entities/product'
import { Badge, Flex, Group, Image, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { getErrorContent } from '@shared/lib/error'
import { ErrorFallbackUi } from '@shared/ui/error-fallback'

type TProductDetailsProps = {
  productId: number
}

export const ProductDetails: React.FC<TProductDetailsProps> = ({ productId }) => {
  const { data: product, isPending, isError, error, refetch } = useProduct(productId)

  if (isPending) {
    return <Loader size="sm" />
  }

  if (isError) {
    const { title, message } = getErrorContent(error)

    return <ErrorFallbackUi title={title} message={message} onReset={() => void refetch()} />
  }

  if (!product) {
    return null
  }

  return (
    <>
      <Group gap="xs" mt="lg">
        <Badge variant="light">{product.category}</Badge>
        <Badge variant="outline">{product.brand}</Badge>
      </Group>

      <Title order={2} mb="md">
        {product.title}
      </Title>

      <Flex gap="xl" align="flex-start" direction={{ base: 'column', sm: 'row' }} w="100%">
        <Paper withBorder p="xs" radius="md" w="fit-content">
          <Image
            src={product.thumbnail}
            alt={product.title}
            maw={300}
            w={300}
            fit="contain"
            fallbackSrc={product.images[0] ?? product.thumbnail}
          />
        </Paper>

        <Stack gap="xs" flex={1} maw="100%">
          <Text size="xl" fw={700}>
            ${product.price}
          </Text>
          <Text c="dimmed">Discount: {product.discountPercentage}%</Text>
          <Text>Rating: {product.rating}</Text>
          <Text>In stock: {product.stock}</Text>
          <Text>{product.description}</Text>
        </Stack>
      </Flex>
    </>
  )
}
