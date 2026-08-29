export type TContextMenuItem<TTarget> = {
  id: string
  label: string
  icon?: React.ReactNode
  color?: 'red'
  disabled?: boolean | ((target: TTarget) => boolean)
  onClick: (target: TTarget) => void
}

export type TContextMenuPosition = {
  x: number
  y: number
}
