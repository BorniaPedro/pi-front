// lib/stratumSchema.ts
import { z } from 'zod';

// Schema para validação do formulário
export const stratumFormSchema = z.object({
  name: z.string()
    .min(1, { message: 'O nome do stratum é obrigatório.' })
    .max(50, { message: 'O nome do stratum deve ter no máximo 50 caracteres.' }),
  landUseBaseline: z.string()
    .min(1, { message: 'O uso atual da terra é obrigatório.' })
    .max(50, { message: 'O uso atual da terra deve ter no máximo 100 caracteres.' }),
  landUseProject: z.string()
    .min(1, { message: 'O uso projetado da terra é obrigatório.' })
    .max(50, { message: 'O uso projetado da terra deve ter no máximo 100 caracteres.' }),
  projectId: z.number(),
  agbStockBaseline: z.number().nullable(),
  agbGrowthBaseline: z.number().nullable(),
  agbStockProject: z.number().nullable(),
  agbGrowthProject: z.number().nullable(),
  agbToBgbRatio: z.number().nullable(),
  yearsToAgbMaxStock: z.number().nullable(),
  SOCref: z.number().nullable(),
  flu: z.number().nullable(),
  fi: z.number().nullable(),
  SOCbaseline: z.number().nullable(),
  SOCmaxProject: z.number().nullable(),
  AnnualSOCchange: z.number().nullable(),
  yearsToSOCmaxProject: z.number().nullable(),
});

export type StratumForm = z.infer<typeof stratumFormSchema>;

// Interface para visualização/exibição dos dados
export interface VisualizacaoStratum {
  id: number;
  name: string;
  landUseBaseline: string;
  landUseProject: string;
  projectId: number;

  agbStockBaseline: number | null;
  agbGrowthBaseline: number | null;
  agbStockProject: number | null;
  agbGrowthProject: number | null;
  agbToBgbRatio: number | null;
  yearsToAgbMaxStock: number | null;
  SOCref: number | null;
  flu: number | null;
  fi: number | null;
  SOCbaseline: number | null;
  SOCmaxProject: number | null;
  AnnualSOCchange: number | null;
  yearsToSOCmaxProject: number | null;
}

export interface Stratum extends VisualizacaoStratum {
  // Inclui informações adicionais do stratum, se houver
}