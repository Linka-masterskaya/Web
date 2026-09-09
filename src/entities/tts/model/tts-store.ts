import { createStore } from '@shared/lib/store'
import type { TTtsVoice } from './tts.schema'

type TTtsState = {
  voices: TTtsVoice[]
}

type TTtsActions = {
  setVoices: (voices: TTtsVoice[]) => void
}

type TTtsStore = TTtsState & TTtsActions

const initialState: TTtsState = {
  voices: [],
}

export const useTtsStore = createStore<TTtsStore>('TtsStore')((set) => ({
  ...initialState,

  setVoices: (voices) => {
    set({ voices })
  },
}))
