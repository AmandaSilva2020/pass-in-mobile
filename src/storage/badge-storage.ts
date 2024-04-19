import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BadgeStorage = {
    id: string,
    name: string,
    email: string,
    eventTitle: string,
    checkInURL: string,
    image?: string
}

type StateProps = {
    data: BadgeStorage | null,
    save: (data: BadgeStorage) => void,
    updateAvatar: (uri: string) => void,
    remove: () => void
}

export const useBadgeStorage = create(
    persist<StateProps>(
        (set) => ({
    data: null,

    save: (data: BadgeStorage) => set(() => ({ data })),
    updateAvatar: (uri: string) => set((state) => ({
        data: state.data ? { ...state.data, image: uri} : state.data
    })),
    remove: () => set(() => ({ data: null })),
}), {
   name: "nlw-unite:badge",
   storage: createJSONStorage(()=> AsyncStorage), 
}))