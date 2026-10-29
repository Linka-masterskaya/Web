import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api/get-product'
import { productQueryKeys } from '../lib/query-keys'

export const useProduct = (id: number) =>
  useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: id > 0,
  })
