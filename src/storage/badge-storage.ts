import { create } from "zustand";

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
    save: (data: BadgeStorage) => void
}

export const useBadgeStorage = create<StateProps>((set) => ({
    data: null,

    save: (data: BadgeStorage) => set(() => ({ data })),
}))