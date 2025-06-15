// hooks/useCadastroProjeto.ts
import { useMutation } from '@tanstack/react-query';
import { ProjetoForm } from '@/lib/cadastroProjetoSchema';
import { alertError, alertSuccess } from '@/lib/alert';

export function useCadastroProjeto() {
    return useMutation({
        mutationFn: async (projeto: ProjetoForm) => {
            const response = await fetch('/api/projetos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projeto),
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar projeto');
            }

            return response.json();
        },
        onSuccess: () => {
            // Redirecionar e mostrar mensagem de sucesso
            alertSuccess('Projeto cadastrado com sucesso!');
        },
        onError: (error) => {
            alertError(error.message);
        },
    });
}