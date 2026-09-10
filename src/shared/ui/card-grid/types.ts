export type TCardGridItem = {
  id: string
  imageSrc?: string
  title?: string
}

export type TCardGridSize = {
  rows: number
  cols: number
}

type TCardGridBaseProps = {
  title?: string
  size: TCardGridSize
  cards: TCardGridItem[]
}

export type TCardGridProps =
  | (TCardGridBaseProps & {
      mode?: never
      isMultiselect: false
      value: string
      onChange: (id: string) => void
    })
  | (TCardGridBaseProps & {
      mode?: never
      isMultiselect: true
      value: string[]
      onChange: (ids: string[]) => void
    })
  | (TCardGridBaseProps & {
      mode: 'plain'
      isMultiselect?: never
      value?: never
      onChange?: never
      onCardClick?: (id: string) => void
    })
  | (TCardGridBaseProps & {
      mode: 'order'
      isMultiselect?: never
      value?: never
      onChange?: never
      onCardClick?: (id: string) => void
    })

export type TCardGridCardProps = {
  imageSrc?: string
  title?: string
  active?: boolean
  indicator?: TCardGridCardIndicator
  onClick?: () => void
  onFocus?: () => void
}

export type TCardGridCardIndicator =
  | {
      type: 'check'
      selected: boolean
      selectedActive?: boolean
    }
  | {
      type: 'order'
      value: number
    }
