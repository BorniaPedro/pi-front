import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { userSchema } from "@/lib/schemas";

type UserFormData = z.infer<typeof userSchema>;

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao cadastrar usuário");
      }

      return response.json();
    },
  });
}
