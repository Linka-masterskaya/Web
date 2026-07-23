export type TNumberStepperProps = {
  /** Текущее значение */
  value: number
  /** Колбэк изменения значения. Вызывается с шагом ±1 */
  onChange: (value: number) => void
  /** Минимально допустимое значение */
  min: number
  /** Максимально допустимое значение */
  max: number
  /** Доступное имя контрола для ассистивных технологий */
  'aria-label'?: string
  /** id видимой подписи (альтернатива aria-label) */
  'aria-labelledby'?: string
}
