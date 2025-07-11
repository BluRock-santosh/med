import { create } from 'zustand';
import type { Medication, MedicationFormData } from '@/types/medication';
import { 
  addMedication, 
  getMedications, 
  updateMedication, 
  deleteMedication,
  markMedicationAsTaken,
  isMedicationTakenToday,
  getMedicationsNotTakenToday
} from '@/firebase/medications';

type MedicationStore = {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMedications: (userId: string) => Promise<void>;
  addMedication: (medicationData: MedicationFormData, userId: string) => Promise<void>;
  updateMedication: (medicationId: string, updates: Partial<MedicationFormData>) => Promise<void>;
  deleteMedication: (medicationId: string) => Promise<void>;
  markAsTaken: (medicationId: string, userId: string) => Promise<void>;
  checkTakenToday: (medicationId: string, userId: string) => Promise<boolean>;
  getNotTakenToday: (userId: string) => Promise<Medication[]>;
  
  // State setters
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],
  loading: false,
  error: null,

  fetchMedications: async (userId: string) => {
    console.log('Fetching medications for user:', userId);
    set({ loading: true, error: null });
    try {
      const medications = await getMedications(userId);
      console.log('Fetched medications:', medications);
      set({ medications, loading: false });
    } catch (error) {
      console.error('Error fetching medications:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch medications', 
        loading: false 
      });
    }
  },

  addMedication: async (medicationData: MedicationFormData, userId: string) => {
    set({ loading: true, error: null });
    try {
      await addMedication(medicationData, userId);
      // Refresh the medications list
      await get().fetchMedications(userId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add medication', 
        loading: false 
      });
    }
  },

  updateMedication: async (medicationId: string, updates: Partial<MedicationFormData>) => {
    set({ loading: true, error: null });
    try {
      await updateMedication(medicationId, updates);
      // Update the medication in the store
      set(state => ({
        medications: state.medications.map(med => 
          med.id === medicationId 
            ? { ...med, ...updates, updatedAt: new Date() }
            : med
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update medication', 
        loading: false 
      });
    }
  },

  deleteMedication: async (medicationId: string) => {
    set({ loading: true, error: null });
    try {
      await deleteMedication(medicationId);
      // Remove from store
      set(state => ({
        medications: state.medications.filter(med => med.id !== medicationId),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete medication', 
        loading: false 
      });
    }
  },

  markAsTaken: async (medicationId: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      await markMedicationAsTaken(medicationId, userId);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark medication as taken', 
        loading: false 
      });
    }
  },

  checkTakenToday: async (medicationId: string, userId: string) => {
    try {
      return await isMedicationTakenToday(medicationId, userId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to check medication status' 
      });
      return false;
    }
  },

  getNotTakenToday: async (userId: string) => {
    try {
      return await getMedicationsNotTakenToday(userId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get medications not taken today' 
      });
      return [];
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
})); 