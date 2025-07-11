export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'thrice-daily' | 'weekly' | 'custom';
  timeOfDay: string[]; // e.g., ['morning', 'evening'] or ['09:00', '21:00']
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface MedicationTaken {
  id: string;
  medicationId: string;
  userId: string;
  takenAt: Date;
  date: string; // YYYY-MM-DD format for easy querying
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'thrice-daily' | 'weekly' | 'custom';
  timeOfDay: string[];
} 