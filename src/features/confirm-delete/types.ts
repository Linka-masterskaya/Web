export type TConfirmDeleteParams = {
  title: string
  description?: string
  onConfirm: () => void | Promise<void>
  getErrorMessage?: (error: unknown) => string | undefined | Promise<string | undefined>
}
