import { StudentShelfPageSkeleton } from './student-shelf-page.skeleton'

export const lazy = async () => {
  const { StudentShelfPage } = await import('./student-shelf.page')
  return {
    Component: StudentShelfPage,
    HydrateFallback: StudentShelfPageSkeleton,
  }
}
