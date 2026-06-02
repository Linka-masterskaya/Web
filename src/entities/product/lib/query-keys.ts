export const productQueryKeys = {
  all: ['products'] as const,
  list: (limit: number) => [...productQueryKeys.all, 'list', limit] as const,
  detail: (id: number) => [...productQueryKeys.all, 'detail', id] as const,
}
