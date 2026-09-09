import type { TSet } from '../model/set.schema'

/** Сохраняет поля настроек, если частичный ответ PATCH/PUT их не вернул. */
export const mergeSet = (currentSet: TSet | undefined, updatedSet: TSet): TSet => ({
  ...currentSet,
  ...updatedSet,
  age: updatedSet.age ?? currentSet?.age ?? null,
  difficulty: updatedSet.difficulty ?? currentSet?.difficulty ?? null,
  goals: updatedSet.goals ?? currentSet?.goals,
  notes: updatedSet.notes ?? currentSet?.notes,
})
