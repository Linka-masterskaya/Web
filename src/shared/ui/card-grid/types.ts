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
  className?: string
}

export type TCardGridProps =
  | (TCardGridBaseProps & {
      mode: 'single'
      value: string
      onChange: (id: string) => void
    })
  | (TCardGridBaseProps & {
      mode: 'multi'
      value: string[]
      onChange: (ids: string[]) => void
    })
  | (TCardGridBaseProps & {
      mode: 'plain' | 'order'
      onCardClick?: (id: string) => void
    })

export type TCardGridCardProps = {
  imageSrc?: string
  title?: string
  active?: boolean
  indicator?: TCardGridCardIndicator
  onClick?: () => void
  onFocus?: () => void
  onBlur?: () => void
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
