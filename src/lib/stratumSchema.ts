// lib/stratumSchema.ts
import { z } from 'zod';

export const stratumFormSchema = z.object({
    id: z.union([z.string(), z.number()]),
    nome: z.string().min(1, { message: 'O nome do stratum é obrigatório.' }),
    usoAtualTerra: z.string().min(1, { message: 'O uso atual da terra é obrigatório.' }),
    usoProjetadoTerra: z.string().min(1, { message: 'O uso projetado da terra é obrigatório.' }),
    // Incluir informações adicionais abaixo
});

export type StratumForm = z.infer<typeof stratumFormSchema>;

export interface VisualizacaoStratum {
    id: number;
    nome: string;
    usoAtualTerra: string;
    usoProjetadoTerra: string;
}

export interface Stratum extends VisualizacaoStratum {
    // Inclui informações adicionais do stratum
}