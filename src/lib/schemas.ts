import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Username muito curto'),
})

export type User = z.infer<typeof userSchema>