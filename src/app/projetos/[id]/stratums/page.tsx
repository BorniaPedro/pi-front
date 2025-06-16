'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetStratums, useCreateStratum, useDeleteStratum } from '@/hooks/useStratums';
import { StratumCard } from '@/components/stratum/StratumCard';
import { VisualizacaoStratum, StratumForm } from '@/lib/stratumSchema';
import GoBackButton from '@/components/buttons/GoBackButton';
import { StratumEditModal } from '@/components/stratum/editStratumModal';
import { useUpdateStratum } from '@/hooks/useStratums';
import GoBackButton from '@/components/buttons/GoBackButton';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button } from '@mui/material';
import { VisualizacaoStratum } from '@/lib/stratumSchema';

export default function StratumsDoProjetoPage() {
  const params = useParams();
  const projetoIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const createStratumMutation = useCreateStratum();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
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
            agbStockBaseline: formData.agbStockBaseline,
            agbGrowthBaseline: formData.agbGrowthBaseline,
            agbMaxStockProject: formData.agbMaxStockProject,
            agbGrowthProject: formData.agbGrowthProject,
            bgbToAgbRatio: formData.bgbToAgbRatio,
            yearsToAgbMaxStockProject: formData.yearsToAgbMaxStockProject,
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
        AGBgrowth: 0,
        agbStockBaseline: 0,
        agbGrowthBaseline: 0,
        agbMaxStockProject: 0,
        agbGrowthProject: 0,
        bgbToAgbRatio: 0,
        yearsToAgbMaxStockProject: 0,
    });
    };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const {
    data: stratums,
    isLoading,
    error: errorLoadingStratums,
    refetch,
  } = useGetStratums(projetoIdParam ?? '');

  const deleteStratumMutation = useDeleteStratum({
    onSuccess: () => {
      setSnackbarMessage('Stratum apagado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(error.message || 'Erro ao apagar Stratum');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });

  const handleCriarNovoStratum = () => {
    createStratumMutation.mutate({
      name: `Stratum`,
      landUseBaseline: ' ',
      landUseProject: ' ',
      projectId: Number(projetoIdParam),
    });
  };

  const handleEditarStratum = (stratum: VisualizacaoStratum) => {
    console.log('Editar stratum:', stratum);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <CircularProgress />
      </div>
    );
  }


  if (errorLoadingStratums) {
    return (
        <div className="flex justify-center w-full bg-gray-100">
            <div className="max-w-3xl w-3/4 bg-white rounded-2xl shadow-xl p-8 h-full min-h-screen">
                <header className="grid grid-cols-2 mb-6 pb-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Projeto {projetoIdParam}</h1>
                    <div className='flex justify-end'><GoBackButton /></div>
                </header>
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="relative flex items-center justify-between">
        <GoBackButton />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold">
          Stratums do Projeto {projetoIdParam}
        </h1>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={handleCriarNovoStratum}
          color="primary"
        >
          Novo Stratum
        </Button>
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
      {stratums && stratums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stratums.map((stratum) => (
            <StratumCard
              key={stratum.id}
              stratum={stratum}
              onEdit={handleEditarStratum}
              onDelete={() => deleteStratumMutation.mutate(stratum.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 mt-10">
          Nenhum stratum cadastrado para este projeto ainda.
        </p>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
