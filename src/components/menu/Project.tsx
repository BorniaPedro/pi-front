'use client'

import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full min-w-1x1 max-w-4xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
                    <h1 className="text-4xl font-bold">Meus Projetos</h1>
                    <Stack spacing={2} direction="row">
                        <Button sx={{ backgroundColor: '#2979ff', '&:hover': { backgroundColor: '#1a3e8c' } }} size="large" variant="contained">✚ Criar Novo Projeto</Button>
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