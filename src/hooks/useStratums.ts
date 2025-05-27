/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useGetStratums.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StratumForm, Stratum } from '@/lib/stratumSchema';

const STRATUMS_QUERY_KEY = 'stratums';

export function useGetStratums(projetoId: string | number) {
    return useQuery<Stratum[], Error>({
        queryKey: [STRATUMS_QUERY_KEY, ...(projetoId ? [projetoId] : [])],
        queryFn: async (): Promise<Stratum[]> => {
            const url = projetoId ? `/api/stratums/${projetoId}` : '/api/stratums'; // Local da API
            const response = await fetch(url);
            if (!response.ok) {
                let errorMessage = 'Erro ao buscar stratums';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Mantem a mensagem de erro genérica se não for possível extrair do JSON
                }
                throw new Error(errorMessage);
            }
            return response.json();
        }
    })
}

// Hook para criar Stratum
export function useCreateStratum() {
    const queryClient = useQueryClient();

    return useMutation<Stratum, Error, StratumForm & { projetoId: string | number }>({
        mutationFn: async (newStratum: StratumForm & { projetoId: string | number }): Promise<Stratum> => {
            const response = await fetch('/api/stratums', { // Local da API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStratum),
            });
            if (!response.ok) {
                let errorMessage = 'Erro ao criar Stratum';
                try {
                    errorMessage = await response.json();
                } catch (e) {
                    // Mantém a mensagem de erro genérica se não for possível extrair do JSON
                }
                throw new Error(errorMessage);
            }
            return response.json();
        },
        onSuccess: (stratumCriado) => {
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY, stratumCriado.id] });
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY] });
            alert('Stratum criado com sucesso!');
        },
        onError: (error) => {
            alert(error.message);
        },
    })
}

// Hook para atualizar Stratum
export function useUpdateStratum() {
    const queryClient = useQueryClient();

    return useMutation<Stratum, Error, { id: string | number; data: StratumForm }>({
        mutationFn: async (variables: { id: string | number; data: StratumForm }): Promise<Stratum> => {
            const { id, data } = variables;
            const response = await fetch(`/api/stratums/${id}`, { // Local da API
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: 'Erro ao atualizar stratum. Sem resposta JSON.' };
                }
                throw new Error(errorData.message || 'Erro desconhecido ao atualizar stratum.');
            }
            return response.json() as Promise<Stratum>;
        },
        onSuccess: (updatedStratum) => {
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY, updatedStratum.id] });
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY] });
            alert('Stratum atualizado com sucesso!');
        },
        onError: (error: Error) => {
            alert(error.message);
        },
    });
}

// Hook para deletar Stratum
export function useDeleteStratum() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: string | number; projetoId?: string | number }>({
        mutationFn: async (variables: { id: string | number; projetoId?: string | number }): Promise<void> => {
            const { id } = variables;
            const response = await fetch(`/api/stratums/${id}`, { // Local da API
                method: 'DELETE',
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: `Erro ao deletar stratum (status: ${response.status}).` };
                }
                throw new Error(errorData.message || 'Erro desconhecido ao deletar stratum.');
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY, variables.projetoId].filter(Boolean) });
            queryClient.invalidateQueries({ queryKey: [STRATUMS_QUERY_KEY] });
            alert('Stratum deletado com sucesso!');
        },
        onError: (error: Error) => {
            alert(error.message);
        },
    });
}