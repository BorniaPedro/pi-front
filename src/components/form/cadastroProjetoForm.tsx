'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { projetoSchema, ProjetoForm } from '@/lib/cadastroProjetoSchema';
import { useState } from 'react';
import OLMap from '@/components/Map';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function CadastroProjetoForm({ usuarioLogado, codigo }: { usuarioLogado: string; codigo: number }) {
    const router = useRouter();
    const [mapaSelecionado, setMapaSelecionado] = useState(false);
    const [dadosLocalizacao, setDadosLocalizacao] = useState<{
        lat: number;
        lon: number;
        clima: string | null;
        gez: string | null;
    } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProjetoForm>({
        resolver: zodResolver(projetoSchema),
        defaultValues: {
            Dono: usuarioLogado,
            Codigo: codigo,
            PaisEstado: "Brasil - Paraná",
        },
    });

    const cadastrarProjetoMutation = useMutation({
        mutationFn: async (data: ProjetoForm) => {
            const response = await fetch('http://localhost:8888/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.Nome,
                    location: "Brazil",
                    state: "Parana",
                    climateZone: data.climateZone,
                    ecologicalZone: data.ecologicalZone,
                    startPeriod: `${data.startYear}-01-01`,
                    endPeriod: `${data.endYear}-01-01`
                }),
            });
            if (!response.ok) throw new Error
            return response.json();
        },
        onSuccess: () => {
            reset();
            setMapaSelecionado(false);
            setDadosLocalizacao(null);
            alert('Projeto cadastrado com sucesso!');
        },
        onError: (error: Error) => alert(error.message || 'Erro ao cadastrar projeto'),
    });

    const startYear = watch('startYear');
    const endYear = watch('endYear');

    const handleSelectLocation = (info: { lat: number; lon: number; clima: string | null; gez: string | null; }) => {
        setDadosLocalizacao(info);
        setValue('Local', { lat: info.lat, lon: info.lon });
        setValue('climateZone', info.clima || '');
        setValue('ecologicalZone', info.gez || '');
        setMapaSelecionado(true);
    };

    const onSubmit = (data: ProjetoForm) => {
        if (!mapaSelecionado) {
            alert('Selecione uma localização no mapa antes de enviar');
            return;
        }
        cadastrarProjetoMutation.mutate(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full min-w-1x1 max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Novo Projeto</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nome do Projeto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Projeto</label>
                        <input
                            {...register('Nome')}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.Nome ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Digite o nome do projeto"
                        />
                        {errors.Nome && <p className="mt-1 text-sm text-red-600">{errors.Nome.message}</p>}
                    </div>

                    {/* Dono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dono do Projeto</label>
                        <input
                            {...register('Dono')}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 border"
                        />
                    </div>

                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código do Projeto</label>
                        <input
                            {...register('Codigo')}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 border"
                        />
                    </div>

                    {/* Localização - Mapa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Localização - Clique no mapa para selecionar</label>
                        <div className="border rounded-md overflow-hidden w-min-h-[200px]">
                            <OLMap onSelectInfo={handleSelectLocation} />
                        </div>
                        {mapaSelecionado && dadosLocalizacao && (
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <p>Latitude: {dadosLocalizacao.lat.toFixed(6)}, Longitude: {dadosLocalizacao.lon.toFixed(6)}</p>
                                <p>IPCC Climate Zone: {dadosLocalizacao.clima || 'Não identificado'}</p>
                                <p>Global Ecological Zone: {dadosLocalizacao.gez || 'Não identificado'}</p>
                            </div>
                        )}
                        {errors.Local && <p className="mt-1 text-sm text-red-600">{errors.Local.message}</p>}
                        {errors.climateZone && <p className="mt-1 text-sm text-red-600">{errors.climateZone.message}</p>}
                        {errors.ecologicalZone && <p className="mt-1 text-sm text-red-600">{errors.ecologicalZone.message}</p>}
                    </div>

                    {/* País/Região */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">País/Região</label>
                        <input
                            {...register('PaisEstado')}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 border"
                        />
                    </div>

                    {/* IPCC Climate Zone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">IPCC Climate Zone</label>
                        <input
                            {...register('climateZone')}
                            readOnly
                            className={`mt-1 block w-full rounded-md shadow-sm bg-gray-100 p-2 border ${errors.climateZone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Global Ecological Zone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Global Ecological Zone</label>
                        <input
                            {...register('ecologicalZone')}
                            readOnly
                            className={`mt-1 block w-full rounded-md shadow-sm bg-gray-100 p-2 border ${errors.ecologicalZone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Ano de Início */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ano de Início</label>
                        <input
                            type="number"
                            {...register('startYear', { valueAsNumber: true })}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.startYear ? 'border-red-500' : 'border-gray-300'}`}
                            min={new Date().getFullYear()}
                            max={2050}
                        />
                    </div>

                    {/* Ano Final */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ano Final</label>
                        <input
                            type="number"
                            {...register('endYear', { valueAsNumber: true })}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border ${errors.endYear ? 'border-red-500' : 'border-gray-300'}`}
                            min={startYear || new Date().getFullYear()}
                            max={2050}
                        />
                    </div>

                    {/* Período (anos) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Período (anos)</label>
                        <input
                            value={startYear && endYear ? endYear - startYear + 1 : 0}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 border"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                setMapaSelecionado(false);
                                setDadosLocalizacao(null);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isSubmitting}
                        >
                            Limpar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none disabled:opacity-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Cadastrando...
                                </span>
                            ) : (
                                'Cadastrar Projeto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}