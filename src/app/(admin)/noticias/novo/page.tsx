import { NoticiaForm } from "@/modules/editorial/presentation/noticia-form";
import { criarNoticiaAction } from "@/modules/editorial/application/noticia.actions";
import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";

export default async function NovaNoticiaPage() {
  const editorias = await listarEditorias();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Nova Notícia</h1>
        <p className="text-sm text-gray-500">
          Preencha os dados abaixo. Você pode salvar como rascunho e publicar
          depois.
        </p>
      </div>

      <NoticiaForm
        editorias={editorias.map((e) => ({ id: e.id, nome: e.nome }))}
        action={criarNoticiaAction}
      />
    </div>
  );
}
