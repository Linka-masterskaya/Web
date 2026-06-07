import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ErrorFallbackUi } from './error-fallback-ui'

const meta = {
  title: 'Shared/ErrorFallbackUi',
  component: ErrorFallbackUi,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onReset: fn(),
  },
} satisfies Meta<typeof ErrorFallbackUi>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
}

export const WithoutMessage: Story = {
  args: {
    title: 'Something went wrong',
  },
}
