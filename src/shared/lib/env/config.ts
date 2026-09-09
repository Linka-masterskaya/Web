import { getEnv, getRequiredEnv } from './get-env'

const DEFAULT_API_DOMAIN = 'https://linka.rassokha.pro/api/v1'

export const env = {
  apiDomain: () => getEnv('VITE_API_DOMAIN') ?? DEFAULT_API_DOMAIN,

  testNumber: () => getRequiredEnv('VITE_TEST_NUMBER', 'number'),
  testBoolean: () => getRequiredEnv('VITE_TEST_BOOLEAN', 'boolean'),
  testUndefined: () => getEnv('VITE_TEST_UNDEFINED'),
} as const
