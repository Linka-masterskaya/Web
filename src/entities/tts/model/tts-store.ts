import { createStore } from '@shared/lib/store'
import type { TTtsVoice } from './tts.schema'

type TTtsState = {
  voices: TTtsVoice[]
  voiceBySet: Record<string, string>
}

type TTtsActions = {
  setVoices: (voices: TTtsVoice[]) => void
  setVoice: (setId: string, voice: string) => void
}

type TTtsStore = TTtsState & TTtsActions

const initialState: TTtsState = {
  voices: [],
  voiceBySet: {},
}

export const useTtsStore = createStore<TTtsStore>('TtsStore')((set) => ({
  ...initialState,
  setVoice: (setId, voice) =>
    set((state) => ({ voiceBySet: { ...state.voiceBySet, [setId]: voice } })),

  setVoices: (voices) => {
    set({ voices })
  },
}))
