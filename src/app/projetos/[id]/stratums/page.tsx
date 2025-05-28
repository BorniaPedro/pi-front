'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetStratums, useCreateStratum } from '@/hooks/useStratums';
import { StratumCard } from '@/components/stratum/StratumCard';
import { VisualizacaoStratum } from '@/lib/stratumSchema';
import GoBackButton from '@/components/buttons/GoBackButton';

export default function StratumsDoProjetoPage() {
    const params = useParams();
    const projetoIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const createStratumMutation = useCreateStratum();

    const { data: stratums, isLoading, error: errorLoadingStratums, refetch } = useGetStratums(projetoIdParam ?? '');

    if (!projetoIdParam) {
        return (
            <div className="max-w-3xl mx-auto my-5 p-5 font-sans bg-gray-100 rounded-lg shadow-md">
                <p className="text-center p-5 text-lg text-gray-700">ID do projeto não fornecido na URL.</p>
                <Link href="/projetos" className="inline-block px-6 py-3 bg-green-600 text-white rounded-md text-center text-lg mt-5 hover:bg-green-700">
                    Voltar para Projetos
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto my-5 p-5 font-sans bg-gray-100 rounded-lg shadow-md">
                <p className="text-center p-5 text-lg text-gray-700">Carregando stratums...</p>
            </div>
        );
    }
    if (errorLoadingStratums) {
        return (
            <div className="max-w-3xl mx-auto my-5 p-5 font-sans bg-gray-100 rounded-lg shadow-md">
                <p className="text-center p-5 text-lg text-gray-700">
                    Erro ao carregar stratums: {errorLoadingStratums?.message ?? 'Erro desconhecido'}
                </p>
                <button
                    onClick={() => refetch()}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md text-center text-lg mt-5 hover:bg-blue-700"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    // Função para redirecionar para a página de edição
    const handleEditarStratum = (stratum: VisualizacaoStratum) => {
        window.location.href = `/projetos/${projetoIdParam}/stratums/${stratum.id}/editar`;
    };

    // Função para criar um novo stratum
    const handleCriarNovoStratum = () => {

        createStratumMutation.mutate({
            name: `Stratum`,
            landUseBaseline: ' ',
            landUseProject: ' ',
            projectId: Number(projetoIdParam)
        });
    };

    return (
        <div className="flex justify-center w-full bg-gray-100">
            <div className="max-w-3xl w-3/4 bg-white rounded-2xl shadow-xl p-8 h-full min-h-screen">
                <header className="grid grid-cols-2 mb-6 pb-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Projeto { }</h1>
                    <div className='flex justify-end'><GoBackButton /></div>
                </header>

                <div>
                    {stratums && stratums.length > 0 ? (
                        stratums.map((stratum) => (
                            <StratumCard
                                key={stratum.id}
                                stratum={stratum}
                                onEdit={() => handleEditarStratum(stratum)}
                            />
                        ))
                    ) : (
                        <p className="text-center p-5 text-gray-700">
                            Nenhum stratum cadastrado para este projeto ainda.
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <button
                        onClick={handleCriarNovoStratum}
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-md text-lg mt-5 hover:bg-green-800"
                    >
                        ✚ Criar Novo Stratum
                    </button>
                </div>
            </div>
        </div>
    );
}