type TIconName =
  | 'Grid3x3'
  | 'ArrowDown01'
  | 'ListCheck' // не нашла иконку, которая прям один в один как на макете, но можно использовать ListTodo и скрыть квадрат:
  // <ListTodo className="[&>rect]:hidden" /> это если прям очень нужно, чтобы галочка была слева
  | 'ListChecks'
  | 'GitCompareArrows'
  | 'Combine'

export type TAssignmentTypeOption = {
  id: string
  iconName: TIconName
  title: string
}

export type TAssignmentTypeSelectorProps = {
  value: string
  options: TAssignmentTypeOption[]
  onChange: (id: string) => void
  disabled?: boolean
  compact?: boolean
}
