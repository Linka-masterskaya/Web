export const parseProductId = (id: string | undefined): number | null => {
  if (id === undefined) {
    return null
  }

  const parsed = Number(id)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}
