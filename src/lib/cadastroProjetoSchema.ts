import { z } from 'zod';

const anoAtual = new Date().getFullYear();

export const projetoSchema = z.object({
    Nome: z.string().min(1, "Nome do projeto é obrigatório"),
    Dono: z.string(), // Nome do usuário logado
    Codigo: z.number(), // Código do projeto (gerado automaticamente)
    Local: z.object({
        lat: z.number(),
        lon: z.number(),
    }, {
        required_error: "Selecione uma localização no mapa",
    }),
    PaisEstado: z.literal("Brasil - Paraná"),
    climateZone: z.string(),
    ecologicalZone: z.string(),
    startYear: z
        .number({
            required_error: "O ano de início é obrigatório",
        })
        .min(anoAtual, "O ano de início deve ser maior ou igual ao ano atual")
        .max(2100),
    endYear: z
        .number({
            required_error: "O ano final é obrigatório",
        })
        .min(anoAtual, "O ano final deve ser maior ou igual ao ano atual")
        .max(2100),
}).refine(data => data.endYear >= data.startYear, {
    message: "O ano final deve ser maior ou igual ao ano inicial",
    path: ["endYear"],
});

export type ProjetoForm = z.infer<typeof projetoSchema>;