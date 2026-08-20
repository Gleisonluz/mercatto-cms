import type { Metadata } from "next";

import { ListNoticiasUseCase } from "@/modules/editorial/application/use-cases";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";
import { NoticiaCard } from "@/modules/editorial/presentation/noticia-card";
import { appConfig, seoConfig } from "@/shared/config/app.config";

export const metadata: Metadata = {
  title: seoConfig.tituloPadrao,
  description: appConfig.descricaoCurta,
};

/**
 * Revalidação incremental (ISR): sem isso, o Next.js pode
 * pré-renderizar `/` como página 100% estática no build, e uma
 * notícia recém-publicada não apareceria até o próximo deploy —
 * achado registrado como pendência ao final da Sprint 5.1.
 *
 * O Next.js exige que `revalidate` seja um valor literal,
 * estaticamente analisável neste arquivo — não aceita uma
 * referência a `cacheConfig.revalidateHomeSegundos`
 * (`shared/config/app.config.ts`), mesmo sendo `as const`; importar
 * o valor aqui quebra o build ("Invalid segment configuration
 * export"). Por isso o número está fixo abaixo — MANTENHA
 * SINCRONIZADO manualmente com `cacheConfig.revalidateHomeSegundos`
 * se aquele valor mudar.
 */
export const revalidate = 60;

/**
 * Home pública do Mercatto News — primeira versão funcional
 * (Sprint 5.1).
 *
 * Busca notícias publicadas via `ListNoticiasUseCase` (camada de
 * aplicação), nunca acessando o Prisma diretamente. A regra de
 * "o que conta como publicado" mora inteiramente no repositório
 * (`listarPublicadas`: `status = PUBLICADA`, ordenado por
 * `publicadoEm` desc) — não é reimplementada aqui.
 *
 * Página 100% Server Component: nenhum `"use client"`, nenhuma
 * interatividade — apenas leitura e links.
 */
export default async function HomePage() {
  const useCase = new ListNoticiasUseCase(noticiaRepository);
  const resultado = await useCase.execute({
    apenasPublicadas: true,
    paginacao: { pagina: 1, itensPorPagina: 12 },
  });

  const editorias = await listarEditorias();
  const editoriasPorId = Object.fromEntries(
    editorias.map((editoria) => [editoria.id, editoria.nome]),
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {appConfig.nome}
        </h1>
        <p className="max-w-2xl text-gray-600">{appConfig.descricaoCurta}</p>
      </header>

      {resultado.itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-600">
            Nenhuma notícia publicada no momento.
          </p>
          <p className="text-sm text-gray-400">
            Volte em breve para conferir as novidades do Mercatto News.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.itens.map((noticia) => (
            <NoticiaCard
              key={noticia.id}
              noticia={noticia}
              nomeEditoria={editoriasPorId[noticia.editoriaId] ?? null}
            />
          ))}
        </section>
      )}
    </main>
  );
}
