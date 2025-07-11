export type UserRole = 'patient' | 'caretaker';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
 
} 