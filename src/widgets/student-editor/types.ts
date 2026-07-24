import type { TStudentFormValues } from '@entities/student'
import type { TStudentFormSubmitMeta } from '@features/student-form'

export type TStudentEditorMode = 'create' | 'edit'

export type TStudentEditorProps = {
  mode: TStudentEditorMode
  defaultValues?: Partial<TStudentFormValues>
  avatarSrc?: string | null
  onClose?: () => void
  onSubmit?: (values: TStudentFormValues, meta: TStudentFormSubmitMeta) => void | Promise<void>
}
