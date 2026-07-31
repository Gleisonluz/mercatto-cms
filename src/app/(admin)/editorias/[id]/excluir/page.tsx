import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { obterEditoriaPorId } from "@/modules/editorial/infrastructure/editoria.repository";
import { excluirEditoriaAction } from "@/modules/editorial/application/editoria.actions";

/**
 * Tela dedicada de confirmação de exclusão.
 *
 * A exclusão também pode ser feita diretamente pela lista (modal de
 * confirmação), mas esta rota existe como fluxo explícito e acessível
 * via link direto, sem depender de JavaScript no cliente.
 */
export default async function ExcluirEditoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const editoria = await obterEditoriaPorId(id);

  if (!editoria) {
    notFound();
  }

  const acaoComId = excluirEditoriaAction.bind(null, id);

  return (
    <div className="flex max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Excluir Editoria</h1>
      <p className="text-sm text-gray-600">
        Tem certeza que deseja excluir a editoria{" "}
        <strong>{editoria.nome}</strong>? Esta ação não pode ser desfeita.
      </p>

      <div className="flex gap-3">
        <form action={acaoComId}>
          <Button type="submit" variant="destructive">
            Confirmar exclusão
          </Button>
        </form>
        <Button variant="outline" asChild>
          <Link href="/editorias">Cancelar</Link>
        </Button>
      </div>
    </div>
  );
}
