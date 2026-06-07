import type { StorybookConfig } from '@storybook/react-vite'
import { viteAliases } from '../vite.aliases.ts'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      ...viteAliases,
    }
    return config
  },
}

export default config
