import Link from "next/link";

import { auth } from "@/shared/lib/auth";
import { ListarUsuariosUseCase } from "@/modules/usuarios/application/use-cases";
import { usuarioRepository } from "@/modules/usuarios/infrastructure/usuario.repository";
import { UsuariosTable } from "@/modules/usuarios/presentation/usuarios-table";

/**
 * Lista de Usuários — tela principal do módulo (Admin → Usuários).
 * Server Component: busca os dados via `ListarUsuariosUseCase`
 * (camada de aplicação), nunca diretamente via Prisma.
 *
 * Sem busca textual nesta etapa: nem o repository (Sprint 4.1) nem o
 * Use Case (Sprint 4.2) suportam nenhum parâmetro de busca — criar
 * um campo de busca aqui seria puramente decorativo, então foi
 * deliberadamente deixado de fora (ver item 15 desta Sprint).
 */
export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { pagina } = await searchParams;
  const paginaAtual = Number(pagina) > 0 ? Number(pagina) : 1;

  const session = await auth();

  const useCase = new ListarUsuariosUseCase(usuarioRepository);
  const resultado = await useCase.execute({
    paginacao: { pagina: paginaAtual, itensPorPagina: 20 },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-sm text-gray-500">
          Gerencie o acesso da equipe ao Mercatto CMS.
        </p>
      </div>

      <p className="text-xs text-gray-400">
        {resultado.total} usuário(s) cadastrado(s)
        {resultado.totalPaginas > 1
          ? ` — página ${resultado.pagina} de ${resultado.totalPaginas}.`
          : "."}
      </p>

      <UsuariosTable
        usuarios={resultado.itens}
        usuarioLogadoId={session?.user?.id ?? ""}
      />

      {resultado.totalPaginas > 1 && (
        <nav className="flex items-center justify-center gap-4 text-sm">
          {paginaAtual > 1 ? (
            <Link
              href={`/usuarios?pagina=${paginaAtual - 1}`}
              className="text-gray-600 hover:underline"
            >
              ← Página anterior
            </Link>
          ) : (
            <span className="text-gray-300">← Página anterior</span>
          )}
          <span className="text-gray-400">
            {paginaAtual} / {resultado.totalPaginas}
          </span>
          {paginaAtual < resultado.totalPaginas ? (
            <Link
              href={`/usuarios?pagina=${paginaAtual + 1}`}
              className="text-gray-600 hover:underline"
            >
              Próxima página →
            </Link>
          ) : (
            <span className="text-gray-300">Próxima página →</span>
          )}
        </nav>
      )}
    </div>
  );
}
