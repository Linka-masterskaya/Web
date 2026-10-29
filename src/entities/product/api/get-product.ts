import { apiClient } from '@shared/lib/api'
import { productDetailSchema, type TProductDetail } from '../model/product.schema'

export const getProduct = async (id: number): Promise<TProductDetail> =>
  apiClient.get(`products/${id}`).json(productDetailSchema)
