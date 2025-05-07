// hooks/useCadastroProjeto.ts
import { useMutation } from '@tanstack/react-query';
import { ProjetoForm } from '@/lib/cadastroProjetoSchema';

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
            alert('Projeto cadastrado com sucesso!');
        },
        onError: (error) => {
            alert(error.message);
        },
    });
}