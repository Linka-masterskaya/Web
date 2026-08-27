import { apiClient } from '@shared/lib/api'

/** Удаление ученика; 204 — успех, 404 — не найден, 409 — есть student folder */
export const deleteStudent = async (id: string): Promise<void> => {
  await apiClient.delete(`students/${id}`)
}
