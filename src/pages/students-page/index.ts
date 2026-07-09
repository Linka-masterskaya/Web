import { StudentsPageSkeleton } from './students-page.skeleton'

export const lazy = async () => {
  const { StudentsPage } = await import('./students.page')
  return {
    Component: StudentsPage,
    HydrateFallback: StudentsPageSkeleton,
  }
}
