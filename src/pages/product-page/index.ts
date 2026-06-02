import { ProductPageSkeleton } from './product-page.skeleton'

export const lazy = async () => {
  const { ProductPage } = await import('./product.page')
  return {
    Component: ProductPage,
    HydrateFallback: ProductPageSkeleton,
  }
}
