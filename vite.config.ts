import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteAliases } from './vite.aliases'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: viteAliases,
  },
})
