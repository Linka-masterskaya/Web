import { Anchor, createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'sm',
  components: {
    Anchor: Anchor.extend({
      defaultProps: {
        c: 'green.6',
      },
    }),
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
})
