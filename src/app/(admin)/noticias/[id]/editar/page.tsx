import { notFound } from "next/navigation";

import { NoticiaForm } from "@/modules/editorial/presentation/noticia-form";
import { atualizarNoticiaAction } from "@/modules/editorial/application/noticia.actions";
import { GetNoticiaByIdUseCase } from "@/modules/editorial/application/use-cases";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const noticia = await new GetNoticiaByIdUseCase(noticiaRepository).execute({
    id,
  });

  if (!noticia) {
    notFound();
  }

  const editorias = await listarEditorias();
  const acaoComId = atualizarNoticiaAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar Notícia</h1>
        <p className="text-sm text-gray-500">{noticia.titulo}</p>
      </div>

      <NoticiaForm
        noticia={noticia}
        editorias={editorias.map((e) => ({ id: e.id, nome: e.nome }))}
        action={acaoComId}
      />
    </div>
  );
}
