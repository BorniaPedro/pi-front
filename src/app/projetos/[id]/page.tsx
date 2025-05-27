import { CadastroProjetoForm } from '@/components/form/cadastroProjetoForm';

export default function CadastroProjetoPage() {
    // obter o usuário logado e o codigo do projeto
    const usuarioLogado = "Usuário Teste";
    const codigoProjeto = 12345;

    return (
        <main>
            <CadastroProjetoForm usuarioLogado={usuarioLogado} codigo={codigoProjeto} />
        </main>
    );
}