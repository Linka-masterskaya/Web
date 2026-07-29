type TIconName =
  | 'Grid3x3'
  | 'ArrowDown01'
  | 'ListCheck'
  | 'ListChecks'
  | 'GitCompareArrows'
  | 'Split' // не нашла нужную, подобрала по смыслу, если подскажете, буду благодарна!

export type TAssignmentTypeOption = {
  id: string
  iconName: TIconName
  title: string
}

export type TAssignmentTypeSelectorProps = {
  value: string
  options: TAssignmentTypeOption[]
  onChange: (id: string) => void
}
