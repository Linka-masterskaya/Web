import { z } from 'zod'

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
})

export const productDetailSchema = productSchema.extend({
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string(),
})

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type TProduct = z.infer<typeof productSchema>
export type TProductDetail = z.infer<typeof productDetailSchema>
export type TProductsResponse = z.infer<typeof productsResponseSchema>
