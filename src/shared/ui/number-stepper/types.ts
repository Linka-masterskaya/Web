export type TNumberStepperProps = {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  disabled?: boolean
  label?: string
  /** Доступное имя контрола для ассистивных технологий. Игнорируется, если задан label */
  'aria-label'?: string
  /** id видимой подписи (альтернатива aria-label). Игнорируется, если задан label */
  'aria-labelledby'?: string
}
