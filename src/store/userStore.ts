// src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser, UserRole } from "@/types/user"; 

type UserStore = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  updateUserRole: (role: UserRole) => void;
  logout: () => void;
  isPatient: () => boolean;
  isCaretaker: () => boolean;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUserRole: (role) => set((state) => ({
        user: state.user ? { ...state.user, role } : null
      })),
      logout: () => set({ user: null }),
      isPatient: () => get().user?.role === 'patient',
      isCaretaker: () => get().user?.role === 'caretaker',
    }),
    {
      name: "user-storage", 
    }
  )
);
