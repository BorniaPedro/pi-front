import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { StratumForm } from '@/lib/stratumSchema';

interface UpdateStratumInput extends StratumForm {
    id: number;
}

export function useUpdateStratum() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateStratumInput) => {
            const response = await axios.put(`/api/stratums/${input.id}`, input);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stratums'] });
        },
    });
}

