import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { NoticiaImagem } from "@/modules/editorial/presentation/noticia-imagem";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";

/**
 * Card de notícia usado na grade da Home. Sem interatividade — todo
 * o componente é renderizável em Server Component, sem `"use client"`.
 *
 * Trata explicitamente a ausência de imagem de destaque (mostra um
 * placeholder neutro em vez de quebrar o layout do card) — requisito
 * explícito desta Sprint.
 */
export function NoticiaCard({
  noticia,
  nomeEditoria,
}: {
  noticia: Noticia;
  nomeEditoria: string | null;
}) {
  const textoResumo = noticia.resumo ?? noticia.linhaFina;

  return (
    <Link
      href={`/noticia/${noticia.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
    >
      <div className="aspect-video w-full bg-gray-100">
        {noticia.imagemDestaqueUrl ? (
          <NoticiaImagem
            url={noticia.imagemDestaqueUrl}
            alt={noticia.imagemDestaqueAlt ?? noticia.titulo}
            width={800}
            height={450}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            Mercatto News
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {nomeEditoria && (
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {nomeEditoria}
          </span>
        )}

        <h2 className="text-lg font-semibold leading-snug text-gray-900 group-hover:underline">
          {noticia.titulo}
        </h2>

        {textoResumo && (
          <p className="line-clamp-2 text-sm text-gray-600">{textoResumo}</p>
        )}

        {noticia.publicadoEm && (
          <span className="mt-auto pt-2 text-xs text-gray-400">
            {format(new Date(noticia.publicadoEm), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </span>
        )}
      </div>
    </Link>
  );
}
