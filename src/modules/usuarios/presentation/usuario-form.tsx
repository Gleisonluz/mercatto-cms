"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";
import type { EstadoFormularioUsuario } from "@/modules/usuarios/application/usuario.actions";

type AcaoFormulario = (
  prevState: EstadoFormularioUsuario,
  formData: FormData,
) => Promise<EstadoFormularioUsuario>;

const OPCOES_PAPEL = [
  { value: "SUPER_ADMINISTRADOR", label: "Super Administrador" },
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "EDITOR_CHEFE", label: "Editor-chefe" },
  { value: "EDITOR", label: "Editor" },
  { value: "JORNALISTA", label: "Jornalista" },
  { value: "COLUNISTA", label: "Colunista" },
  { value: "FOTOGRAFO", label: "Fotógrafo" },
  { value: "COMERCIAL", label: "Comercial" },
];

/**
 * Formulário reutilizável de Usuário — usado tanto em `/usuarios/novo`
 * quanto em `/usuarios/[id]/editar`. A diferença entre os dois casos
 * é apenas a Server Action recebida via prop `action`.
 *
 * `ativo` não é um campo deste formulário — é gerenciado
 * exclusivamente pelas ações de Desativar/Reativar na listagem.
 * Nunca exibe nem pré-preenche a senha atual (nem existe como dado
 * disponível aqui: `Usuario` já não carrega `senhaHash`).
 */
export function UsuarioForm({
  usuario,
  action,
}: {
  usuario?: Usuario;
  action: AcaoFormulario;
}) {
  const [estado, formAction] = useActionState(action, {});
  const ehEdicao = Boolean(usuario);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      {estado.message && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {estado.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            name="nome"
            required
            defaultValue={usuario?.nome ?? ""}
            placeholder="Ex.: Maria Silva"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={usuario?.email ?? ""}
            placeholder="voce@mercattonews.com.br"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="senha">
            {ehEdicao ? "Nova senha" : "Senha *"}
          </Label>
          <Input
            id="senha"
            name="senha"
            type="password"
            required={!ehEdicao}
            minLength={8}
            placeholder={ehEdicao ? "" : "Mínimo de 8 caracteres"}
          />
          {ehEdicao && (
            <p className="text-xs text-gray-400">
              Deixe em branco para manter a senha atual.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="papel">Papel *</Label>
          <Select id="papel" name="papel" required defaultValue={usuario?.papel ?? ""}>
            <option value="" disabled>
              Selecione um papel
            </option>
            {OPCOES_PAPEL.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="avatarUrl">Avatar (URL)</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            defaultValue={usuario?.avatarUrl ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {ehEdicao ? "Salvar alterações" : "Criar usuário"}
        </SubmitButton>
        <Button variant="outline" asChild type="button">
          <Link href="/usuarios">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
