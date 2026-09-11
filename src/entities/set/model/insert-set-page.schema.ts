import { z } from 'zod'

import { setPageSchema } from './set-config.schema'

/** Параметры вставки страницы из буфера обмена. */
export const insertSetPageParamsSchema = z.object({
  /** Страница с уже подготовленными (новыми) идентификаторами. */
  page: setPageSchema,
  /** id страницы, после которой вставляем; null — в конец набора. */
  afterPageId: z.string().min(1).nullable(),
  /** id страницы, которую нужно удалить в том же запросе (перемещение при «вырезать»). */
  removePageId: z.string().min(1).optional(),
})

export type TInsertSetPageParams = z.infer<typeof insertSetPageParamsSchema>
