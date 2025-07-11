import { z } from 'zod';

 export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),});

export const medicationSchema = z.object({
        name: z.string().min(1, 'Medication name is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.enum(['daily', 'twice-daily', 'thrice-daily', 'weekly', 'custom']),
        timeOfDay: z.array(z.string()).min(1, 'At least one time is required'),
      });


export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export  type MedicationFormData = z.infer<typeof medicationSchema>;