'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetStratums, useCreateStratum } from '@/hooks/useStratums';
import { StratumCard } from '@/components/stratum/StratumCard';
import { VisualizacaoStratum, StratumForm } from '@/lib/stratumSchema';
import GoBackButton from '@/components/buttons/GoBackButton';
import { StratumEditModal } from '@/components/stratum/editStratumModal';
import { useUpdateStratum } from '@/hooks/useStratums';

export default function StratumsDoProjetoPage() {
    const params = useParams();
    const projetoIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const createStratumMutation = useCreateStratum();

    const { data: stratums, isLoading, error: errorLoadingStratums, refetch } = useGetStratums(projetoIdParam ?? '');

    const [modalOpen, setModalOpen] = useState(false);
    const [stratumSelecionado, setStratumSelecionado] = useState<VisualizacaoStratum | null>(null);
    const updateStratumMutation = useUpdateStratum();

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

    const handleEditarStratum = (stratum: VisualizacaoStratum) => {
    setStratumSelecionado(stratum);
    setModalOpen(true);
};

    const handleSalvarEdicao = (formData: StratumForm) => {
    if (!stratumSelecionado) return;

    updateStratumMutation.mutate(
        {
            id: stratumSelecionado.id,
            data: {
                name: formData.name,
                landUseBaseline: formData.landUseBaseline,
                landUseProject: formData.landUseProject,
                projectId: stratumSelecionado.projectId,
                AGBstock: formData.AGBstock,
                AGBgrowth: formData.AGBgrowth,
            },
        },
            {
                onSuccess: () => {
                    setModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Erro ao atualizar o stratum:', error);
                    alert('Erro ao atualizar stratum');
                },
            }
        );
    };

    const handleCriarNovoStratum = () => {
        createStratumMutation.mutate({
            name: `Stratum`,
            landUseBaseline: ' ',
            landUseProject: ' ',
            projectId: Number(projetoIdParam),
            AGBstock: 0,
            AGBgrowth: 0
        });
    };

    return (
        <div className="flex justify-center w-full bg-gray-100">
            <div className="max-w-3xl w-3/4 bg-white rounded-2xl shadow-xl p-8 h-full min-h-screen">
                <header className="grid grid-cols-2 mb-6 pb-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Projeto {projetoIdParam}</h1>
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

            <StratumEditModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                stratum={stratumSelecionado}
                onSave={handleSalvarEdicao}
            />
        </div>
    );
}
