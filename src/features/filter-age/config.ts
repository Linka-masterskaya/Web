export const FILTER_AGE_MIN = 3
export const FILTER_AGE_MAX = 18

export const FILTER_AGE_OPTIONS: { value: string; label: string }[] = Array.from(
  { length: FILTER_AGE_MAX - FILTER_AGE_MIN + 1 },
  (_, i) => {
    const age = FILTER_AGE_MIN + i
    return { value: String(age), label: `${age} лет` }
  },
)
