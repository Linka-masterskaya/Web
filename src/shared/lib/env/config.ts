import { getEnv, getRequiredEnv } from './get-env'

const DEFAULT_API_DOMAIN = 'https://linka.rassokha.pro/api/v1'

export const env = {
  apiDomain: () => getEnv('VITE_API_DOMAIN') ?? DEFAULT_API_DOMAIN,

  // возвращает true только в dev-режиме, если моки явно включаны в env.local
  useSectionContentMock: () =>
    import.meta.env.DEV && (getEnv('VITE_USE_SECTION_CONTENTS_MOCK', 'boolean') ?? false),

  testNumber: () => getRequiredEnv('VITE_TEST_NUMBER', 'number'),
  testBoolean: () => getRequiredEnv('VITE_TEST_BOOLEAN', 'boolean'),
  testUndefined: () => getEnv('VITE_TEST_UNDEFINED'),
} as const
