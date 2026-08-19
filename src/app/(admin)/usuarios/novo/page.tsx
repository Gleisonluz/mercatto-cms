import { UsuarioForm } from "@/modules/usuarios/presentation/usuario-form";
import { criarUsuarioAction } from "@/modules/usuarios/application/usuario.actions";

export default function NovoUsuarioPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Novo Usuário</h1>
        <p className="text-sm text-gray-500">
          Preencha os dados abaixo para conceder acesso ao Mercatto CMS.
        </p>
      </div>

      <UsuarioForm action={criarUsuarioAction} />
    </div>
  );
}
