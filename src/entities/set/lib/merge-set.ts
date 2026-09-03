import type { TSet } from '../model/set.schema'

/** Сохраняет поля настроек, если частичный ответ PATCH/PUT их не вернул. */
export const mergeSet = (currentSet: TSet | undefined, updatedSet: TSet): TSet => ({
  ...currentSet,
  ...updatedSet,
  ageMin: updatedSet.ageMin ?? currentSet?.ageMin,
  ageMax: updatedSet.ageMax ?? currentSet?.ageMax,
  difficulty: updatedSet.difficulty ?? currentSet?.difficulty,
  goals: updatedSet.goals ?? currentSet?.goals,
  notes: updatedSet.notes ?? currentSet?.notes,
})
