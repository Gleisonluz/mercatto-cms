import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";
import { EditoriasTable } from "@/modules/editorial/presentation/editorias-table";

/**
 * Lista de Editorias — tela principal do módulo (Admin → Editorias).
 * Server Component: busca os dados diretamente via repositório
 * (sem passar por API Route), conforme padrão de Server Components
 * do Next.js App Router.
 */
export default async function EditoriasPage() {
  const editorias = await listarEditorias();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editorias</h1>
        <p className="text-sm text-gray-500">
          Organize o conteúdo do Mercatto News por editorias temáticas.
        </p>
      </div>

      <EditoriasTable editorias={editorias} />
    </div>
  );
}
