import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
});