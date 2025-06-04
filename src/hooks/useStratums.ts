
// hooks/useGetStratums.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StratumForm, Stratum } from '@/lib/stratumSchema';
import { alertError, alertSuccess } from '@/lib/alert';

const STRATUMS_QUERY_KEY = 'stratums';

export function useGetStratums(projetoId: string | number) {
    return useQuery<Stratum[], Error>({
        queryKey: [STRATUMS_QUERY_KEY, ...(projetoId ? [projetoId] : [])],
        queryFn: async (): Promise<Stratum[]> => {
            //const url = projetoId ? `/api/stratums/${projetoId}` : '/api/stratums'; // Local da API
            const response = await fetch(`http://localhost:8888/project/stratum/${projetoId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao buscar stratums (status: ${response.status})`);
            }
            return response.json();
        }
    })
}

// Hook para criar Stratum
export function useCreateStratum() {
    const queryClient = useQueryClient();

    return useMutation<Stratum, Error, StratumForm>({
        mutationFn: async (newStratum) => {
            const response = await fetch('http://localhost:8888/stratum', { // Local da API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStratum),
            });
            console.log(newStratum)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao criar Stratum (status: ${response.status})`);
            }
            return response.json();
        },
        onSuccess: (stratumCriado) => {
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY, stratumCriado.id] });
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY] });
        },
        onError: (error) => {
            alertError(error.message);
        },
    })
}

// Hook para atualizar Stratum
export function useUpdateStratum() {
    const queryClient = useQueryClient();

    return useMutation<Stratum, Error, { id: string | number; data: StratumForm }>({
        mutationFn: async (variables: { id: string | number; data: StratumForm }): Promise<Stratum> => {
            const { id, data } = variables;
            const response = await fetch(`http://localhost:8888/stratum/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao atualizar Stratum (status: ${response.status})`);
            }
            return response.json() as Promise<Stratum>;
        },
        onSuccess: (updatedStratum) => {
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY, updatedStratum.id] });
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY] });
            alertSuccess('Stratum atualizado com sucesso!');
        },
        onError: (error: Error) => {
            alertError(error.message);
        },
    });
}

// Hook para deletar Stratum
export function useDeleteStratum() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`http://localhost:8888/stratum/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ao apagar Stratum (status: ${response.status})`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stratums'] });
            alertSuccess('Stratum deletado com sucesso!');
        },
        onError: (error: Error) => {
            alertError(error.message);
        },
    });
}