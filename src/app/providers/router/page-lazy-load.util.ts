import type { ComponentType } from 'react'

type TPageLazyRoute = {
  Component: ComponentType
  HydrateFallback?: ComponentType
}

type TPageLazyModule = {
  lazy: () => Promise<TPageLazyRoute>
}

export const pageLazyLoad = (importPage: () => Promise<TPageLazyModule>) => {
  return () => importPage().then((module) => module.lazy())
}
