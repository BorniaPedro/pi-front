// components/stratum/StratumCard.tsx
'use client';

import React from 'react';
import { VisualizacaoStratum } from '@/lib/stratumSchema';
import { useDeleteStratum } from '@/hooks/useStratums';

interface StratumCardProps {
    stratum: VisualizacaoStratum;
    onEdit: (stratum: VisualizacaoStratum) => void;
}

export function StratumCard({ stratum, onEdit }: StratumCardProps) {
    const deleteStratumMutation = useDeleteStratum();

    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja apagar o stratum "${stratum.nome}" (ID: ${stratum.id})?`)) {
            deleteStratumMutation.mutate({ id: stratum.id, projetoId: stratum.id });
        }
    };

    const cardStyle: React.CSSProperties = {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    };

    const infoStyle: React.CSSProperties = {
        marginRight: '16px',
        flexGrow: 1, // Permite que a área de informações cresça
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column', // Botões empilhados
        gap: '8px', // Espaço entre botões
        flexShrink: 0, // Impede que os botões encolham
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        minWidth: '80px',
        textAlign: 'center',
        fontSize: '0.9em',
    };

    return (
        <div style={cardStyle}>
            <div style={infoStyle}>
                <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#555' }}>
                    <strong>ID:</strong> {stratum.id}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#555' }}>
                    <strong>Nome:</strong> {stratum.nome}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#555' }}>
                    <strong>Uso Atual da Terra:</strong> {stratum.usoAtualTerra}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#555' }}>
                    <strong>Uso Projetado da Terra:</strong> {stratum.usoProjetadoTerra}
                </p>
                {/* Se quiser mostrar detalhesCriacao ou outros campos da interface Stratum, adicione aqui */}
                {/* {stratum.detalhesCriacao && (
                    <p style={{ margin: '4px 0', fontSize: '0.8em', color: '#777' }}>
                        <strong>Detalhes:</strong> {stratum.detalhesCriacao}
                    </p>
                )} */}
            </div>
            <div style={buttonGroupStyle}>
                <button
                    onClick={() => onEdit(stratum)}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    aria-label={`Editar stratum ${stratum.nome}`}
                    title="Editar Stratum"
                >
                    Editar
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleteStratumMutation.isPending}
                    style={{ ...buttonStyle, backgroundColor: deleteStratumMutation.isPending ? '#ef9a9a' : '#dc3545', color: 'white' }}
                    aria-label={`Apagar stratum ${stratum.nome}`}
                    title="Apagar Stratum"
                >
                    {deleteStratumMutation.isPending ? 'Apagando...' : 'Apagar'}
                </button>
            </div>
        </div>
    );
}