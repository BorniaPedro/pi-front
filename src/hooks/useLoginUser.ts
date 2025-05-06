import { useMutation } from "@tanstack/react-query";

export function useLoginUser() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar link de login");
      }

      return response.json();
    },
  });
}