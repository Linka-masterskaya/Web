export const accessLevel = {
  auth: 'auth',
  guest: 'guest',
  public: 'public',
} as const

export type TAccessLevel = (typeof accessLevel)[keyof typeof accessLevel]
