'use client';

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import { VisualizacaoStratum } from '@/lib/stratumSchema';
import { useDeleteStratum } from '@/hooks/useStratums';

interface StratumCardProps {
    stratum: VisualizacaoStratum;
    onEdit: (stratum: VisualizacaoStratum) => void;
    onDelete: () => void;
}

export function StratumCard({ stratum, onEdit, onDelete }: StratumCardProps) {
    const deleteStratumMutation = useDeleteStratum();

    const handleDelete = async () => {
        const confirm = window.confirm(`Tem certeza que deseja apagar o stratum "${stratum.name}" (ID: ${stratum.id})?`);
        if (confirm) {
            onDelete();
        }
    };

    return (
        <Card variant="outlined" sx={{ boxShadow: 1 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {stratum.name} {stratum.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    <strong>Uso Atual:</strong> {stratum.landUseBaseline || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Uso Projetado:</strong> {stratum.landUseProject || '—'}
                </Typography>
            </CardContent>
            <CardActions>
                <Stack direction="row" spacing={1} sx={{ ml: 1, mb: 1 }}>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onEdit(stratum)}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={deleteStratumMutation.isPending}
                    >
                        {deleteStratumMutation.isPending ? 'Apagando...' : 'Apagar'}
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
}
