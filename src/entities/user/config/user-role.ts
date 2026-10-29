// Роли пользователя, доступные в API (GET /profile/me → role)
export const userRole = {
  defectologist: 'defectologist',
  headDefectologist: 'head_defectologist',
} as const

export type TUserRole = (typeof userRole)[keyof typeof userRole]
