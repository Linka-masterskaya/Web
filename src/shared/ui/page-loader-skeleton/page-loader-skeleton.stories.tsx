import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageLoaderSkeleton } from './page-loader-skeleton'

const meta = {
  title: 'Shared/PageLoaderSkeleton',
  component: PageLoaderSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PageLoaderSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
