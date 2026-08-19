import { notFound } from "next/navigation";

import { UsuarioForm } from "@/modules/usuarios/presentation/usuario-form";
import { atualizarUsuarioAction } from "@/modules/usuarios/application/usuario.actions";
import { ObterUsuarioPorIdUseCase } from "@/modules/usuarios/application/use-cases";
import { usuarioRepository } from "@/modules/usuarios/infrastructure/usuario.repository";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const usuario = await new ObterUsuarioPorIdUseCase(usuarioRepository).execute(
    { id },
  );

  if (!usuario) {
    notFound();
  }

  const acaoComId = atualizarUsuarioAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar Usuário</h1>
        <p className="text-sm text-gray-500">{usuario.nome}</p>
      </div>

      <UsuarioForm usuario={usuario} action={acaoComId} />
    </div>
  );
}
