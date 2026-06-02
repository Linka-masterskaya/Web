import { ProductDetails, parseProductId } from '@features/product-details'
import { Anchor, Stack } from '@mantine/core'
import { createUrl, routerPath } from '@shared/lib/routes'
import { Link, useParams } from 'react-router'

export const ProductPage: React.FC = () => {
  const { id: idParam } = useParams()
  const productId = parseProductId(idParam)

  if (productId === null) {
    throw new Response(null, { status: 404, statusText: 'Not Found' })
  }

  return (
    <Stack gap="md" align="flex-start">
      <Anchor component={Link} to={createUrl(routerPath.dashboard)}>
        ← Back to dashboard
      </Anchor>

      <ProductDetails productId={productId} />
    </Stack>
  )
}
