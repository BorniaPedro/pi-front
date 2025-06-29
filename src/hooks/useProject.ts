// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertError, alertSuccess } from '@/lib/alert';

const PROJECTS_QUERY_KEY = 'projects';

export interface Project {
  id: number;
  name: string;
  startPeriod: string;
  endPeriod: string;
}

export function useGetProjects() {
  return useQuery<Project[], Error>({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch('http://localhost:8888/project', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao buscar projetos (status: ${response.status})`);
      }
      return response.json();
    },
  });
}

export function useDeleteProject(callbacks?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:8888/project/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao deletar projeto (status: ${response.status})`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      callbacks?.onSuccess?.();
      alertSuccess('Projeto deletado com sucesso!');
    },
    onError: (error: Error) => {
      callbacks?.onError?.(error);
      alertError(error.message);
    },
  });
}
