export type TNumberStepperProps = {
  /** Текущее значение */
  value: number
  /** Колбэк изменения значения. Вызывается с шагом ±1 */
  onChange: (value: number) => void
  /** Минимально допустимое значение */
  min: number
  /** Максимально допустимое значение */
  max: number
  /** Видимая подпись поля (например, «Количество вариантов») */
  label?: string
  /** Доступное имя контрола для ассистивных технологий. Игнорируется, если задан label */
  'aria-label'?: string
  /** id видимой подписи (альтернатива aria-label). Игнорируется, если задан label */
  'aria-labelledby'?: string
}
