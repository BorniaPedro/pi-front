'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetStratums } from '@/hooks/useStratums';
import { StratumCard } from '@/components/stratum/StratumCard';
import { VisualizacaoStratum } from '@/lib/stratumSchema';

const pageContainerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
};

const titleStyle: React.CSSProperties = {
    color: '#333',
    fontSize: '1.8em',
    margin: 0,
};

const loadingErrorStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px',
    fontSize: '1.1em',
    color: '#555',
};

const createLinkStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: '20px',
    transition: 'background-color 0.2s ease',
};

export default function StratumsDoProjetoPage() {
    const params = useParams();
    const projetoIdParam = Array.isArray(params.projetoId) ? params.projetoId[0] : params.projetoId;

    //const { data: stratums, isLoading, error: errorLoadingStratums, refetch } = useGetStratums(projetoIdParam ?? '');
    const stratums = [
        { id: 1, nome: 'Stratum 1', usoAtualTerra: 'Agricultura', usoProjetadoTerra: 'Floresta' },
        { id: 2, nome: 'Stratum 2', usoAtualTerra: 'Pastagem', usoProjetadoTerra: 'Reserva' },
    ];
    const isLoading = false;
    const errorLoadingStratums = null;
    const refetch = () => { };

    if (!projetoIdParam) {
        return (
            <div style={pageContainerStyle}>
                <p style={loadingErrorStyle}>ID do projeto não fornecido na URL.</p>
                <Link href="/projetos" style={createLinkStyle}>Voltar para Projetos</Link>
            </div>
        );
    }

    if (isLoading) {
        return <div style={pageContainerStyle}><p style={loadingErrorStyle}>Carregando stratums...</p></div>;
    }

    if (errorLoadingStratums) {
        return (
            <div style={pageContainerStyle}>
                <p style={loadingErrorStyle}>Erro ao carregar stratums: {errorLoadingStratums.message}</p>
                <button onClick={() => refetch()} style={{ ...createLinkStyle, backgroundColor: '#007bff' }}>Tentar Novamente</button>
            </div>
        );
    }

    // Função para redirecionar para a página de edição
    const handleEditarStratum = (stratum: VisualizacaoStratum) => {
        window.location.href = `/projetos/${projetoIdParam}/stratums/${stratum.id}/editar`;
    };

    return (
        <div style={pageContainerStyle}>
            <header style={headerStyle}>
                <h1 style={titleStyle}>Stratums do Projeto {projetoIdParam}</h1>
            </header>

            <div>
                {stratums && stratums.length > 0 ? (
                    stratums.map((stratum) => (
                        <StratumCard
                            key={stratum.id}
                            stratum={stratum}
                            onEdit={() => handleEditarStratum(stratum)}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                        Nenhum stratum cadastrado para este projeto ainda.
                    </p>
                )}
            </div>

            <div style={{ textAlign: 'center' }}>
                <Link
                    href={`/projetos/${projetoIdParam}/stratums/novo`}
                    style={createLinkStyle}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                >
                    ✚ Criar Novo Stratum
                </Link>
            </div>
        </div>
    );
}