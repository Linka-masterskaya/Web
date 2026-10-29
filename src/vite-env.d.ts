/// <reference types="vite/client" />

import type { IImportMetaEnv } from '@shared/lib/env/types'

declare global {
  interface ImportMetaEnv extends IImportMetaEnv {}
}
