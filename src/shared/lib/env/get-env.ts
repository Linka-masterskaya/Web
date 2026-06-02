import type { IImportMetaEnv } from './types'

export type ViteEnvKey = Extract<keyof IImportMetaEnv, `VITE_${string}`>

export type EnvPrimitiveKind = 'string' | 'number' | 'boolean'

export type ParsedEnvValue<T extends EnvPrimitiveKind> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : never

const readRawEnv = (key: ViteEnvKey): string | undefined => {
  const raw = import.meta.env[key]

  if (raw === undefined || raw === null) {
    return undefined
  }

  const value = String(raw).trim()

  return value === '' ? undefined : value
}

const parseEnvValue = <T extends EnvPrimitiveKind>(raw: string, type: T): ParsedEnvValue<T> => {
  switch (type) {
    case 'string':
      return raw as ParsedEnvValue<T>
    case 'number': {
      const value = Number(raw)

      if (Number.isNaN(value)) {
        throw new Error(`value "${raw}" is not a valid number`)
      }

      return value as ParsedEnvValue<T>
    }
    case 'boolean': {
      const normalized = raw.toLowerCase()

      if (['true', '1', 'yes'].includes(normalized)) {
        return true as ParsedEnvValue<T>
      }

      if (['false', '0', 'no'].includes(normalized)) {
        return false as ParsedEnvValue<T>
      }

      throw new Error(`value "${raw}" is not a valid boolean`)
    }
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

const readEnv = <T extends EnvPrimitiveKind>(
  key: ViteEnvKey,
  type: T,
): ParsedEnvValue<T> | undefined => {
  const raw = readRawEnv(key)

  if (raw === undefined) {
    return undefined
  }

  try {
    return parseEnvValue(raw, type)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Environment variable "${key}": ${message}`)
  }
}

export function getRequiredEnv(key: ViteEnvKey): string
export function getRequiredEnv<T extends 'number' | 'boolean'>(
  key: ViteEnvKey,
  type: T,
): ParsedEnvValue<T>
export function getRequiredEnv<T extends EnvPrimitiveKind>(
  key: ViteEnvKey,
  type?: T,
): ParsedEnvValue<T> {
  const kind = (type ?? 'string') as T
  const value = readEnv(key, kind)

  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is required but not set`)
  }

  return value
}

export function getEnv(key: ViteEnvKey): string | undefined
export function getEnv<T extends 'number' | 'boolean'>(
  key: ViteEnvKey,
  type: T,
): ParsedEnvValue<T> | undefined
export function getEnv<T extends EnvPrimitiveKind>(
  key: ViteEnvKey,
  type?: T,
): ParsedEnvValue<T> | undefined {
  const kind = (type ?? 'string') as T
  return readEnv(key, kind)
}
