import Link from "next/link";

import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";
import { appConfig } from "@/shared/config/app.config";

/**
 * Header de navegação pública — Sprint 6.4.
 *
 * Sem isso, um visitante não tinha nenhuma forma de descobrir ou
 * navegar entre `/`, `/[categoria]` e `/noticia/[slug]` a não ser
 * digitando a URL diretamente (achado do diagnóstico da Sprint 6.4).
 *
 * Reutiliza `listarEditorias()` (Sprint 2) — mesma função já usada
 * pela Home para resolver nomes de editoria. Filtra por `ativo` na
 * apresentação: a função já retorna todas as editorias sem esse
 * filtro (usado assim de propósito no admin), então aqui só
 * escolhemos quais das editorias já retornadas aparecem no menu
 * público — não é uma nova regra de negócio, é seleção de exibição.
 *
 * Server Component: nenhuma interatividade, nenhum `"use client"`.
 */
export async function PublicHeader() {
  const editorias = await listarEditorias();
  const editoriasAtivas = editorias.filter((editoria) => editoria.ativo);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900"
        >
          {appConfig.nome}
        </Link>

        {editoriasAtivas.length > 0 && (
          <nav aria-label="Editorias" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {editoriasAtivas.map((editoria) => (
              <Link
                key={editoria.id}
                href={`/${editoria.slug}`}
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                {editoria.nome}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
