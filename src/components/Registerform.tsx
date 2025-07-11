import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterSchema } from "@/schema/schema";
import { registerSchema } from "@/schema/schema";
import { register as registerUser } from "@/firebase/auth";
import { useUserStore } from "@/store/userStore";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await registerUser(data);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userCredential.user.displayName || data.name,
        role: 'patient', // Default role, will be changed in role selection
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
