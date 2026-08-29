import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ConfigStore {
  mapPlayComplete: boolean;
  activeSpeakerCity: string | null;
  setActiveSpeakerCity: (city: string | null) => void;
  toggle: (key: keyof Omit<ConfigStore, "toggle" | "setActiveSpeakerCity">) => void;
  reset: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set, _, store) => ({
    mapPlayComplete: false,
    activeSpeakerCity: null,
    setActiveSpeakerCity: (city) => set({ activeSpeakerCity: city }),
    toggle: (key) => set((s) => ({ [key]: !s[key] })),
    reset: () => set(store.getInitialState()),
  }))
);
