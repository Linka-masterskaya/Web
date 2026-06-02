import { createContext } from 'react'
import type { TModalContextValue } from '../types'

export const ModalContext = createContext<TModalContextValue | null>(null)
