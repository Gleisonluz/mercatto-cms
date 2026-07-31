"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";
import { editoriaSchema } from "@/modules/editorial/domain/editoria.schema";
import { gerarSlug } from "@/modules/editorial/domain/value-objects/slug";
import * as editoriaRepository from "@/modules/editorial/infrastructure/editoria.repository";

const CAMINHO_LISTA = "/editorias";

export type EstadoFormularioEditoria = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
};

/**
 * Garante que existe uma sessão ativa antes de executar qualquer
 * mutação. Defesa em profundidade: o middleware já protege as rotas
 * `(admin)`, mas a Server Action é validada novamente aqui (02.00 §8 —
 * segurança é responsabilidade de todo o sistema, não só do middleware).
 */
async function exigirSessao() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sessão inválida ou expirada.");
  }
  return session;
}

/**
 * Resolve o slug final: usa o informado manualmente (se houver) ou
 * gera automaticamente a partir do nome. Garante unicidade
 * adicionando um sufixo numérico em caso de colisão.
 */
async function resolverSlugUnico(
  nome: string,
  slugInformado: string | undefined,
  ignorarId?: string,
): Promise<string> {
  const base = gerarSlug(slugInformado || nome);
  let candidato = base;
  let sufixo = 2;

  while (await editoriaRepository.slugJaExiste(candidato, ignorarId)) {
    candidato = `${base}-${sufixo}`;
    sufixo += 1;
  }

  return candidato;
}

export async function criarEditoriaAction(
  _prevState: EstadoFormularioEditoria,
  formData: FormData,
): Promise<EstadoFormularioEditoria> {
  await exigirSessao();

  const dadosBrutos = Object.fromEntries(formData.entries());
  const resultado = editoriaSchema.safeParse({
    ...dadosBrutos,
    ativo: formData.get("ativo") === "on" || formData.get("ativo") === "true",
  });

  if (!resultado.success) {
    return {
      errors: resultado.error.flatten().fieldErrors,
      message: "Verifique os campos destacados.",
    };
  }

  const dados = resultado.data;
  const slugFinal = await resolverSlugUnico(dados.nome, dados.slug);

  await editoriaRepository.criarEditoria({
    ...dados,
    slug: slugFinal,
    descricao: dados.descricao || null,
    cor: dados.cor || null,
    icone: dados.icone || null,
    imagemCapaUrl: dados.imagemCapaUrl || null,
    seoTitle: dados.seoTitle || null,
    seoDescription: dados.seoDescription || null,
  });

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function atualizarEditoriaAction(
  id: string,
  _prevState: EstadoFormularioEditoria,
  formData: FormData,
): Promise<EstadoFormularioEditoria> {
  await exigirSessao();

  const existente = await editoriaRepository.obterEditoriaPorId(id);
  if (!existente) {
    return { message: "Editoria não encontrada." };
  }

  const dadosBrutos = Object.fromEntries(formData.entries());
  const resultado = editoriaSchema.safeParse({
    ...dadosBrutos,
    ativo: formData.get("ativo") === "on" || formData.get("ativo") === "true",
  });

  if (!resultado.success) {
    return {
      errors: resultado.error.flatten().fieldErrors,
      message: "Verifique os campos destacados.",
    };
  }

  const dados = resultado.data;
  const slugFinal = await resolverSlugUnico(dados.nome, dados.slug, id);

  await editoriaRepository.atualizarEditoria(id, {
    ...dados,
    slug: slugFinal,
    descricao: dados.descricao || null,
    cor: dados.cor || null,
    icone: dados.icone || null,
    imagemCapaUrl: dados.imagemCapaUrl || null,
    seoTitle: dados.seoTitle || null,
    seoDescription: dados.seoDescription || null,
  });

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function excluirEditoriaAction(id: string): Promise<void> {
  await exigirSessao();
  await editoriaRepository.excluirEditoria(id);
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}
