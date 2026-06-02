import { useProducts } from '@entities/product'
import {
  Alert,
  AspectRatio,
  Button,
  Group,
  Image,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import { createUrl, routerPath, useRouteQueryParams } from '@shared/lib/routes'
import { Link } from 'react-router'
import { PRODUCTS_LIMIT_OPTIONS } from './config'
import { getProductsLimit } from './utils/get-products-limit'

export const ProductList: React.FC = () => {
  const { queryParams, setQueryParams } = useRouteQueryParams()
  const limit = getProductsLimit(queryParams.perPage)

  const { data: products, isPending, isFetching, isError, error, refetch } = useProducts(limit)

  const handleRevalidate = () => {
    void refetch()
  }

  const handleLimitChange = (value: string | null) => {
    if (!value) {
      return
    }

    setQueryParams({ perPage: value }, false)
  }

  return (
    <>
      <Title order={2} c="green" mt="md">
        Products
      </Title>

      <Group gap="sm">
        <Button
          variant="outline"
          onClick={handleRevalidate}
          loading={isFetching && !isPending}
          disabled={isPending || isError}
        >
          Refetch
        </Button>

        <Select
          aria-label="Products count"
          data={PRODUCTS_LIMIT_OPTIONS.map((value) => String(value))}
          value={String(limit)}
          onChange={handleLimitChange}
          w={72}
          disabled={isPending || isError}
        />
      </Group>

      {isPending && <Loader size="sm" />}

      {isError && (
        <Alert color="red" title="Failed to load products">
          {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      )}

      {products && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md" w="100%">
          {products.map((product) => (
            <Paper
              key={product.id}
              component={Link}
              to={createUrl(routerPath.card, { id: String(product.id) })}
              withBorder
              p="xs"
              radius="sm"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <AspectRatio ratio={1}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  radius="sm"
                  fit="cover"
                  fallbackSrc={product.images[0] ?? product.thumbnail}
                />
              </AspectRatio>
              <Text size="xs" mt="xs" lineClamp={2}>
                {product.id}. {product.title}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
