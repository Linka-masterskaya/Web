import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir =
  typeof __dirname !== 'undefined'
    ? path.resolve(__dirname)
    : path.dirname(fileURLToPath(import.meta.url))

export const viteAliases = {
  '@app': path.resolve(rootDir, './src/app'),
  '@shared': path.resolve(rootDir, './src/shared'),
  '@pages': path.resolve(rootDir, './src/pages'),
  '@widgets': path.resolve(rootDir, './src/widgets'),
  '@features': path.resolve(rootDir, './src/features'),
  '@entities': path.resolve(rootDir, './src/entities'),
}
