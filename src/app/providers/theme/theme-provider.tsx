import { MantineProvider } from '@mantine/core'
import { theme } from './config'
import type { TThemeProviderProps } from './types'
import '@mantine/core/styles.css'
import '@app/styles/global.scss'

export const ThemeProvider: React.FC<TThemeProviderProps> = ({ children }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
)
