import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
});
