import { accessLevel, type TAccessLevel } from '../config/access-level'

export const isAccessLevelVisible = (level: TAccessLevel, isAuth: boolean) => {
  if (level === accessLevel.public) {
    return true
  }

  if (level === accessLevel.auth) {
    return isAuth
  }

  return !isAuth
}
