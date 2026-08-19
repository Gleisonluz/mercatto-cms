"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";
import { acessoAdminPorPapel } from "@/shared/config/roles.config";
import { usuarioRepository } from "@/modules/usuarios/infrastructure/usuario.repository";
import {
  CriarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  DesativarUsuarioUseCase,
  ReativarUsuarioUseCase,
} from "@/modules/usuarios/application/use-cases";
import type { Papel } from "@/modules/usuarios/domain/entities/usuario.entity";

const CAMINHO_LISTA = "/usuarios";

export type EstadoFormularioUsuario = {
  message?: string;
};

/**
 * Garante sessão ativa E papel autorizado antes de qualquer mutação
 * de usuário. Reutiliza exatamente `acessoAdminPorPapel["/usuarios"]`
 * (já existente em `roles.config.ts` desde o Sprint 1: apenas
 * SUPER_ADMINISTRADOR e ADMINISTRADOR) — não cria um segundo sistema
 * de permissões.
 *
 * Defesa em profundidade: o middleware já protege as rotas
 * `(admin)/usuarios`, mas gestão de usuários é uma operação sensível
 * o bastante para justificar a checagem própria também aqui, mesmo
 * padrão já usado em `midia.actions.ts` (Sprint 3.6).
 */
async function exigirSessaoComPermissaoDeUsuarios() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sessão inválida ou expirada.");
  }

  const papeisPermitidos = acessoAdminPorPapel["/usuarios"];
  if (!papeisPermitidos.includes(session.user.role as never)) {
    throw new Error("Seu perfil não tem permissão para gerenciar usuários.");
  }

  return session;
}

export async function criarUsuarioAction(
  _prevState: EstadoFormularioUsuario,
  formData: FormData,
): Promise<EstadoFormularioUsuario> {
  await exigirSessaoComPermissaoDeUsuarios();

  const avatarUrl = String(formData.get("avatarUrl") ?? "") || null;

  try {
    await new CriarUsuarioUseCase(usuarioRepository).execute({
      nome: String(formData.get("nome") ?? ""),
      email: String(formData.get("email") ?? ""),
      senha: String(formData.get("senha") ?? ""),
      papel: String(formData.get("papel") ?? "") as Papel,
      avatarUrl,
    });
  } catch (erro) {
    return {
      message: erro instanceof Error ? erro.message : "Erro ao criar usuário.",
    };
  }

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function atualizarUsuarioAction(
  id: string,
  _prevState: EstadoFormularioUsuario,
  formData: FormData,
): Promise<EstadoFormularioUsuario> {
  await exigirSessaoComPermissaoDeUsuarios();

  const avatarUrl = String(formData.get("avatarUrl") ?? "") || null;
  // Senha é opcional na edição: campo em branco = mantém a atual.
  // `ativo` não é editável por este formulário — é gerenciado
  // exclusivamente pelas ações dedicadas de Desativar/Reativar na
  // listagem (item 9/10 desta Sprint), nunca por este campo aqui.
  const senhaInformada = String(formData.get("senha") ?? "");

  try {
    await new AtualizarUsuarioUseCase(usuarioRepository).execute({
      id,
      nome: String(formData.get("nome") ?? ""),
      email: String(formData.get("email") ?? ""),
      papel: String(formData.get("papel") ?? "") as Papel,
      avatarUrl,
      ...(senhaInformada ? { senha: senhaInformada } : {}),
    });
  } catch (erro) {
    return {
      message:
        erro instanceof Error ? erro.message : "Erro ao atualizar usuário.",
    };
  }

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function desativarUsuarioAction(id: string): Promise<void> {
  const session = await exigirSessaoComPermissaoDeUsuarios();

  // Proteção contra auto-desativação: nenhum administrador pode
  // desativar a própria conta por esta tela. Verificada no servidor
  // — a interface pode (e deve) também ocultar o botão, mas isso
  // nunca substitui esta checagem.
  if (session.user.id === id) {
    throw new Error("Você não pode desativar a sua própria conta.");
  }

  await new DesativarUsuarioUseCase(usuarioRepository).execute({ id });
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function reativarUsuarioAction(id: string): Promise<void> {
  await exigirSessaoComPermissaoDeUsuarios();
  await new ReativarUsuarioUseCase(usuarioRepository).execute({ id });
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}
