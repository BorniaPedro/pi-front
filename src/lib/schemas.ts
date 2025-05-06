import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
});

export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
});

export const projectSchema = z.object({
  projectName: z.string().min(1, "Nome do projeto é obrigatório"),
  projectOwner: z.string().min(1, "Dono do projeto é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  countryRegion: z.string().min(1, "País/Região é obrigatório"),
  climateZone: z.string().min(1, "Zona climática é obrigatória"),
  ecologicalZone: z.string().min(1, "Zona ecológica é obrigatória"),
  startYear: z.number().min(1900).max(new Date().getFullYear()),
  endYear: z.number().min(1900).max(2100),
}).refine(data => data.endYear > data.startYear, {
  message: "O ano final deve ser maior que o inicial",
  path: ["endYear"],
});
export type User = z.infer<typeof userSchema>;