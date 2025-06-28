'use client'

import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetProjects } from "@/hooks/useProject";

export default function ProjectMenu() {
    const { data, isLoading, error, refetch } = useGetProjects();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        const errorMessage = (error as Error).message ?? 'Erro desconhecido';
        return (
            <div className="max-w-3xl mx-auto my-5 p-5 font-sans bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
                <p className="text-center p-5 text-lg text-gray-700">
                    Erro ao carregar projetos: {errorMessage}
                </p>
                <button
                    onClick={() => refetch()}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md text-center text-lg mt-5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full min-w-1x1 max-w-4xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
                    <h1 className="text-4xl font-bold">Meus Projetos</h1>
                    <Stack spacing={2} direction="row">
                        <Button
                            sx={{ backgroundColor: '#2979ff', '&:hover': { backgroundColor: '#1a3e8c' } }}
                            size="large"
                            variant="contained"
                            href="/projetos/cadastro"
                        >
                            ✚ Criar Novo Projeto
                        </Button>
                    </Stack>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {data.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}