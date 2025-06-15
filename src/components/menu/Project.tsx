'use client'

import { useMutation, useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import CircularProgress from '@mui/material/CircularProgress';

const fetchProjects = async () => {
    const response = await fetch('http://localhost:8888/project', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao buscar projetos!')
    return response.json();
};

export default function ProjectMenu() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <CircularProgress />
            </div>
        );
    }
    if (error) return <p>Erro ao carregar projetos: {(error as Error).message}</p>;

    return (
        <div className="flex justify-center w-full bg-gray-100">
            <div className="w-3/4 bg-white rounded-2xl shadow-xl p-8 h-full min-h-screen">
                <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
                    <h1 className="text-5xl font-bold">Meus Projetos</h1>
                    <button
                        onClick={() => window.location.href = '/projetos/cadastro/'}
                        className="px-6 py-3 bg-green-500 text-white rounded-md text-lg hover:bg-green-700"
                    >
                        ✚ Criar Novo Projeto
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}