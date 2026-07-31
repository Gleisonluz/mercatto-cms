import { notFound } from "next/navigation";

import { EditoriaForm } from "@/modules/editorial/presentation/editoria-form";
import { atualizarEditoriaAction } from "@/modules/editorial/application/editoria.actions";
import { obterEditoriaPorId } from "@/modules/editorial/infrastructure/editoria.repository";

export default async function EditarEditoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const editoria = await obterEditoriaPorId(id);

  if (!editoria) {
    notFound();
  }

  const acaoComId = atualizarEditoriaAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar Editoria</h1>
        <p className="text-sm text-gray-500">{editoria.nome}</p>
      </div>

      <EditoriaForm editoria={editoria} action={acaoComId} />
    </div>
  );
}
