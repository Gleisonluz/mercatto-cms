import Link from "next/link";

import { ListNoticiasUseCase } from "@/modules/editorial/application/use-cases";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";
import { NoticiasTable } from "@/modules/editorial/presentation/noticias-table";
import type { StatusNoticia } from "@/modules/editorial/domain/entities/noticia.entity";
import { cn } from "@/shared/lib/cn";

const FILTROS_STATUS: { valor: StatusNoticia | "TODAS"; label: string }[] = [
  { valor: "TODAS", label: "Todas" },
  { valor: "RASCUNHO", label: "Rascunho" },
  { valor: "EM_EDICAO", label: "Em edição" },
  { valor: "REVISAO", label: "Revisão" },
  { valor: "AGUARDANDO_APROVACAO", label: "Aguardando aprovação" },
  { valor: "AGENDADA", label: "Agendada" },
  { valor: "PUBLICADA", label: "Publicada" },
  { valor: "ARQUIVADA", label: "Arquivada" },
];

/**
 * Lista de Notícias — tela principal do módulo (Admin → Notícias).
 * Server Component: busca os dados via `ListNoticiasUseCase`
 * (camada de aplicação), nunca diretamente via Prisma.
 *
 * Por padrão lista todas as notícias (Sprint 3.5 — `listarTodas`,
 * ver alteração autorizada no repositório). O filtro por status é
 * aplicado via query string (`?status=...`), sem necessidade de
 * JavaScript no cliente para navegar entre os filtros.
 */
export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusValido = FILTROS_STATUS.some((f) => f.valor === status)
    ? (status as StatusNoticia | "TODAS" | undefined)
    : undefined;

  const useCase = new ListNoticiasUseCase(noticiaRepository);
  const resultado = await useCase.execute({
    status: statusValido && statusValido !== "TODAS" ? statusValido : undefined,
    paginacao: { pagina: 1, itensPorPagina: 50 },
  });

  const editorias = await listarEditorias();
  const editoriasPorId = Object.fromEntries(
    editorias.map((editoria) => [editoria.id, editoria.nome]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Notícias</h1>
        <p className="text-sm text-gray-500">
          Gerencie a produção editorial do Mercatto News.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {FILTROS_STATUS.map((filtro) => {
          const ativo = (statusValido ?? "TODAS") === filtro.valor;
          return (
            <Link
              key={filtro.valor}
              href={
                filtro.valor === "TODAS"
                  ? "/noticias"
                  : `/noticias?status=${filtro.valor}`
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                ativo
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50",
              )}
            >
              {filtro.label}
            </Link>
          );
        })}
      </nav>

      <p className="text-xs text-gray-400">
        {resultado.total} notícia(s) encontrada(s)
        {resultado.totalPaginas > 1
          ? ` — exibindo até ${resultado.itensPorPagina} por página (página ${resultado.pagina} de ${resultado.totalPaginas}).`
          : "."}
      </p>

      <NoticiasTable
        noticias={resultado.itens}
        editoriasPorId={editoriasPorId}
      />
    </div>
  );
}
