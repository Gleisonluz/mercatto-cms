import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { obterEditoriaPorSlug } from "@/modules/editorial/infrastructure/editoria.repository";
import { ListNoticiasUseCase } from "@/modules/editorial/application/use-cases";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import { NoticiaCard } from "@/modules/editorial/presentation/noticia-card";

/**
 * Revalidação incremental (ISR), mesmo padrão da Home (Sprint 5.1).
 * Valor literal — o Next.js exige que `revalidate` seja estaticamente
 * analisável no próprio arquivo, não aceita referência a
 * `cacheConfig` (ver comentário equivalente em `(public)/page.tsx`).
 */
export const revalidate = 60;

type Params = { categoria: string };

async function obterEditoria(categoria: string) {
  return obterEditoriaPorSlug(categoria);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const editoria = await obterEditoria(categoria);

  if (!editoria) {
    return {};
  }

  return {
    title: editoria.seoTitle ?? editoria.nome,
    description:
      editoria.seoDescription ?? editoria.descricao ?? undefined,
  };
}

/**
 * Página pública de listagem de notícias por editoria (Sprint 6.2).
 *
 * Orquestra apenas peças já existentes:
 * - `obterEditoriaPorSlug` (Sprint 2) resolve a editoria pela URL;
 * - `ListNoticiasUseCase` + `listarPublicadasPorEditoria` (Sprint 6.1)
 *   buscam somente as notícias publicadas daquela editoria — a regra
 *   de "o que é publicado" não é reimplementada aqui;
 * - `NoticiaCard` (Sprint 5.1) renderiza cada notícia, com o mesmo
 *   componente já usado na Home.
 */
export default async function CategoriaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria } = await params;
  const editoria = await obterEditoria(categoria);

  if (!editoria) {
    notFound();
  }

  const useCase = new ListNoticiasUseCase(noticiaRepository);
  const resultado = await useCase.execute({
    apenasPublicadas: true,
    editoriaId: editoria.id,
    paginacao: { pagina: 1, itensPorPagina: 12 },
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {editoria.nome}
        </h1>
        {editoria.descricao && (
          <p className="max-w-2xl text-gray-600">{editoria.descricao}</p>
        )}
      </header>

      {resultado.itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-600">
            Nenhuma notícia publicada nesta editoria no momento.
          </p>
          <p className="text-sm text-gray-400">
            Volte em breve para conferir as novidades de {editoria.nome}.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.itens.map((noticia) => (
            <NoticiaCard
              key={noticia.id}
              noticia={noticia}
              nomeEditoria={editoria.nome}
            />
          ))}
        </section>
      )}
    </main>
  );
}
