import type { QueryClient } from '@tanstack/react-query'
import { updateSetConfig } from '../api/update-set-config'
import type { TSet } from '../model/set.schema'
import { useSetEditorStore } from '../model/set-editor.store'
import { mergeSet } from './merge-set'
import { setQueryKeys } from './query-keys'

const saves = new Map<string, Promise<boolean>>()

export const saveSetEditor = (setId: string, queryClient: QueryClient): Promise<boolean> => {
  const existing = saves.get(setId)
  if (existing) {
    return existing
  }
  const save = async () => {
    const store = useSetEditorStore
    try {
      while (true) {
        const snapshot = store.getState()
        if (
          snapshot.setId !== setId ||
          !snapshot.config ||
          snapshot.revision === snapshot.savedRevision
        ) {
          return true
        }
        store.setState({ isSaving: true, saveError: false })
        await queryClient.cancelQueries({ queryKey: setQueryKeys.detail(setId) })
        const result = await updateSetConfig(setId, snapshot.config)
        queryClient.setQueryData<TSet>(setQueryKeys.detail(setId), (current) =>
          mergeSet(current, result),
        )
        if (store.getState().setId === setId) {
          store.setState({ savedRevision: snapshot.revision })
        }
        // Правки, внесённые во время запроса, отправляются следующим запросом.
      }
    } catch {
      if (store.getState().setId === setId) {
        store.setState({ saveError: true })
      }
      return false
    } finally {
      if (store.getState().setId === setId) {
        store.setState({ isSaving: false })
      }
    }
  }
  const promise = save().finally(() => saves.delete(setId))
  saves.set(setId, promise)
  return promise
}
