export type TMatchingGridItem = {
  id: string
  imageSrc: string
  title: string
}

export type TMatchingGridProps = {
  className?: string
  elements: TMatchingGridItem[]
  elementCount: number
  value: string
  onChange: (id: string) => void
}
