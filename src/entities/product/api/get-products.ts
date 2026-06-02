import { apiClient } from '@shared/lib/api'
import { productsResponseSchema, type TProduct } from '../model/product.schema'

export const getProducts = async (limit = 12): Promise<TProduct[]> => {
  const data = await apiClient
    .get('products', { searchParams: { limit } })
    .json(productsResponseSchema)

  return data.products
}
