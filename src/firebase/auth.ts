import { loginSchema, registerSchema } from "@/schema/schema";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { z } from "zod";
import { useUserStore } from "@/store/userStore";


export const login = async (input: z.infer<typeof loginSchema>) => {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid login data");
  }

  const { email, password } = parsed.data;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Update user store with the authenticated user
  useUserStore.getState().setUser({
    uid: userCredential.user.uid,
    email: userCredential.user.email!,
    displayName: userCredential.user.displayName || '',
    role: 'patient', // Default role, can be changed later
    createdAt: new Date(),
    updatedAt: new Date(),
  });


  return userCredential;
};

export const logout = async () => {
  await auth.signOut();
};

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const register = async (input: z.infer<typeof registerSchema>) => {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
        throw new Error("Invalid register data");
    }

    const { name, email, password } = parsed.data;

    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
    }

    // Update user store with the registered user
    useUserStore.getState().setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: name,
        role: 'patient', // Default role, can be changed later
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return userCredential;
};
