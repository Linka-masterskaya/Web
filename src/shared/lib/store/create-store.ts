import { create, type StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type TDevtoolsMutator = ['zustand/devtools', never]

type TPersistConfig<T, P extends Partial<T> = T> = {
  name: string
  partialize?: (state: T) => P
}

type TStoreInitializer<T> = StateCreator<T, [TDevtoolsMutator], [], T>

export const createStore =
  <T, P extends Partial<T> = T>(name: string, persistConfig?: TPersistConfig<T, P>) =>
  (initializer: TStoreInitializer<T>) => {
    const devtoolsOptions = { name, enabled: import.meta.env.DEV }

    if (persistConfig) {
      return create<T>()(
        devtools(
          persist<T, [], [], P>(
            initializer as unknown as StateCreator<T, [['zustand/persist', unknown]], [], T>,
            {
              name: persistConfig.name,
              partialize: persistConfig.partialize,
            },
          ),
          devtoolsOptions,
        ),
      )
    }

    return create<T>()(devtools(initializer, devtoolsOptions))
  }
