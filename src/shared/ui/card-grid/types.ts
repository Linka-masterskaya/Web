export type TCardGridItem = {
  id: string
  imageSrc: string
}

export type TCardGridSize = {
  rows: number
  cols: number
}

export type TCardGridProps =
  | {
      title: string
      size: TCardGridSize
      isMultiselect: false
      cards: TCardGridItem[]
      value: string
      onChange: (id: string) => void
    }
  | {
      title: string
      size: TCardGridSize
      isMultiselect: true
      cards: TCardGridItem[]
      value: string[]
      onChange: (ids: string[]) => void
    }
