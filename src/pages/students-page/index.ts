export const lazy = async () => {
  const { StudentsPage } = await import('./students.page')
  return { Component: StudentsPage }
}
