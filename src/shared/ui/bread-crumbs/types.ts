export type TBreadCrumbItem = {
  id: string | number
  label: string
  href?: string
}

export type TBreadCrumbsProps = {
  items: TBreadCrumbItem[]
}
