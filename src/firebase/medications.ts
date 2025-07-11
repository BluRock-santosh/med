import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Medication, MedicationTaken, MedicationFormData } from '@/types/medication';

const MEDICATIONS_COLLECTION = 'medications';
const MEDICATIONS_TAKEN_COLLECTION = 'medications_taken';

// Add a new medication
export const addMedication = async (medicationData: MedicationFormData, userId: string): Promise<string> => {
  console.log('Adding medication:', medicationData, 'for userId:', userId);
  
  const medication = {
    ...medicationData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  };

  try {
    const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), {
      ...medication,
      createdAt: Timestamp.fromDate(medication.createdAt),
      updatedAt: Timestamp.fromDate(medication.updatedAt),
    });
    
    console.log('Medication added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

// Get all medications for a user
export const getMedications = async (userId: string): Promise<Medication[]> => {
  console.log('Getting medications for userId:', userId);
  try {
    // Simplified query without composite index
    const q = query(
      collection(db, MEDICATIONS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    console.log('Query snapshot:', querySnapshot.docs.length, 'documents');
    
    const medications = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Medication[];
    
    // Filter active medications and sort by date
    const activeMedications = medications
      .filter(med => med.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    console.log('Processed medications:', activeMedications);
    return activeMedications;
  } catch (error) {
    console.error('Error in getMedications:', error);
    throw error;
  }
};

// Update a medication
export const updateMedication = async (medicationId: string, updates: Partial<MedicationFormData>): Promise<void> => {
  const docRef = doc(db, MEDICATIONS_COLLECTION, medicationId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

// Delete a medication (soft delete)
export const deleteMedication = async (medicationId: string): Promise<void> => {
  const docRef = doc(db, MEDICATIONS_COLLECTION, medicationId);
  await updateDoc(docRef, {
    isActive: false,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

// Mark medication as taken for today
export const markMedicationAsTaken = async (medicationId: string, userId: string): Promise<string> => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const medicationTaken: Omit<MedicationTaken, 'id'> = {
    medicationId,
    userId,
    takenAt: new Date(),
    date: today,
  };

  const docRef = await addDoc(collection(db, MEDICATIONS_TAKEN_COLLECTION), {
    ...medicationTaken,
    takenAt: Timestamp.fromDate(medicationTaken.takenAt),
  });

  return docRef.id;
};

// Check if medication was taken today
export const isMedicationTakenToday = async (medicationId: string, userId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  
  const q = query(
    collection(db, MEDICATIONS_TAKEN_COLLECTION),
    where('medicationId', '==', medicationId),
    where('userId', '==', userId),
    where('date', '==', today)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Get medications not taken today
export const getMedicationsNotTakenToday = async (userId: string): Promise<Medication[]> => {
  const medications = await getMedications(userId);
  const notTakenToday: Medication[] = [];

  for (const medication of medications) {
    const isTaken = await isMedicationTakenToday(medication.id, userId);
    if (!isTaken) {
      notTakenToday.push(medication);
    }
  }

  return notTakenToday;
}; 