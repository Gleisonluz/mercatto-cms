import { EditoriaForm } from "@/modules/editorial/presentation/editoria-form";
import { criarEditoriaAction } from "@/modules/editorial/application/editoria.actions";

export default function NovaEditoriaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Nova Editoria</h1>
        <p className="text-sm text-gray-500">
          Preencha os dados abaixo para criar uma nova editoria.
        </p>
      </div>

      <EditoriaForm action={criarEditoriaAction} />
    </div>
  );
}
