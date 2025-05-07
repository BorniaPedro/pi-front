import { z } from "zod";
import { userSchema } from "@/lib/schemas/userSchema";

type UserFormData = z.infer<typeof userSchema>;

export const UserService = {
  create: async (data: UserFormData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }
    return response.json();
  }
};