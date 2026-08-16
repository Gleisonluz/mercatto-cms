import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { GetNoticiaBySlugUseCase } from "@/modules/editorial/application/use-cases";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import { obterEditoriaPorId } from "@/modules/editorial/infrastructure/editoria.repository";

/**
 * Página pública de uma Notícia.
 *
 * Só exibe notícias com `status = PUBLICADA` — uma notícia em
 * rascunho/revisão/agendada não deve ficar acessível publicamente
 * mesmo que alguém tenha o link do slug (regra já existente no
 * domínio, apenas respeitada aqui, não reimplementada).
 */
export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const noticia = await new GetNoticiaBySlugUseCase(noticiaRepository).execute({
    slug,
  });

  if (!noticia || noticia.status !== "PUBLICADA") {
    notFound();
  }

  const editoria = await obterEditoriaPorId(noticia.editoriaId);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-3">
        {editoria && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {editoria.nome}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {noticia.titulo}
        </h1>
        {noticia.linhaFina && (
          <p className="text-lg text-gray-600">{noticia.linhaFina}</p>
        )}
        {noticia.publicadoEm && (
          <p className="text-xs text-gray-400">
            Publicada em{" "}
            {format(new Date(noticia.publicadoEm), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </p>
        )}
      </div>

      {noticia.imagemDestaqueUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- URL externa arbitrária (sem infraestrutura de upload/otimização nesta etapa)
        <img
          src={noticia.imagemDestaqueUrl}
          alt={noticia.imagemDestaqueAlt ?? noticia.titulo}
          className="w-full rounded-lg object-cover"
        />
      )}

      <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
        {noticia.conteudo}
      </div>
    </main>
  );
}
