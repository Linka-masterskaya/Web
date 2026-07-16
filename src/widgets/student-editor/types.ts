import type { TStudentFormValues } from '@entities/student'

export type TStudentEditorMode = 'create' | 'edit'

export type TStudentEditorProps = {
  mode: TStudentEditorMode
  defaultValues?: Partial<TStudentFormValues>
  avatarSrc?: string | null
  onClose?: () => void
  onSubmit?: (values: TStudentFormValues) => void | Promise<void>
}
