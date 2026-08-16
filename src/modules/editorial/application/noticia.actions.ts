"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";
import { noticiaRepository } from "@/modules/editorial/infrastructure/noticia.repository";
import {
  CreateNoticiaUseCase,
  UpdateNoticiaUseCase,
  DeleteNoticiaUseCase,
  GetNoticiaByIdUseCase,
  PublishNoticiaUseCase,
  ArchiveNoticiaUseCase,
} from "@/modules/editorial/application/use-cases";
import type {
  StatusNoticia,
  TipoConteudo,
} from "@/modules/editorial/domain/entities/noticia.entity";

const CAMINHO_LISTA = "/noticias";

export type EstadoFormularioNoticia = {
  message?: string;
};

/**
 * Garante que existe uma sessão ativa antes de executar qualquer
 * mutação. Defesa em profundidade: o middleware já protege as rotas
 * `(admin)`, mas a Server Action é validada novamente aqui — mesmo
 * padrão de `editoria.actions.ts` (02.00 §8).
 */
async function exigirSessao() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sessão inválida ou expirada.");
  }
  return session;
}

/**
 * Extrai os campos comuns do formulário (criação e edição). Não
 * valida nem resolve slug aqui — isso é responsabilidade dos Use
 * Cases (`CreateNoticiaUseCase`/`UpdateNoticiaUseCase`), evitando
 * duplicar regra de negócio já implementada na Sprint 3.3.
 */
function extrairCamposFormulario(formData: FormData) {
  const status = formData.get("status");
  const tipo = formData.get("tipo");

  return {
    titulo: String(formData.get("titulo") ?? ""),
    slug: String(formData.get("slug") ?? "") || undefined,
    linhaFina: String(formData.get("linhaFina") ?? "") || null,
    resumo: String(formData.get("resumo") ?? "") || null,
    conteudo: String(formData.get("conteudo") ?? ""),
    tipo: (tipo ? String(tipo) : "NOTICIA") as TipoConteudo,
    status: (status ? String(status) : "RASCUNHO") as StatusNoticia,
    imagemDestaqueUrl: String(formData.get("imagemDestaqueUrl") ?? "") || null,
    seoTitle: String(formData.get("seoTitle") ?? "") || null,
    seoDescription: String(formData.get("seoDescription") ?? "") || null,
    editoriaId: String(formData.get("editoriaId") ?? ""),
  };
}

export async function criarNoticiaAction(
  _prevState: EstadoFormularioNoticia,
  formData: FormData,
): Promise<EstadoFormularioNoticia> {
  const session = await exigirSessao();
  const campos = extrairCamposFormulario(formData);

  try {
    await new CreateNoticiaUseCase(noticiaRepository).execute({
      ...campos,
      autorId: session.user.id,
    });
  } catch (erro) {
    return {
      message: erro instanceof Error ? erro.message : "Erro ao criar notícia.",
    };
  }

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function atualizarNoticiaAction(
  id: string,
  _prevState: EstadoFormularioNoticia,
  formData: FormData,
): Promise<EstadoFormularioNoticia> {
  await exigirSessao();

  const existente = await new GetNoticiaByIdUseCase(noticiaRepository).execute({
    id,
  });
  if (!existente) {
    return { message: "Notícia não encontrada." };
  }

  const campos = extrairCamposFormulario(formData);

  try {
    await new UpdateNoticiaUseCase(noticiaRepository).execute({
      id,
      ...campos,
      // Autoria e revisão não são editáveis por este formulário —
      // preservam-se os valores já existentes na notícia.
      autorId: existente.autorId,
      editorResponsavelId: existente.editorResponsavelId,
      publicadoEm: existente.publicadoEm,
    });
  } catch (erro) {
    return {
      message:
        erro instanceof Error ? erro.message : "Erro ao atualizar notícia.",
    };
  }

  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function excluirNoticiaAction(id: string): Promise<void> {
  await exigirSessao();
  await new DeleteNoticiaUseCase(noticiaRepository).execute({ id });
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function publicarNoticiaAction(id: string): Promise<void> {
  await exigirSessao();
  await new PublishNoticiaUseCase(noticiaRepository).execute({ id });
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}

export async function arquivarNoticiaAction(id: string): Promise<void> {
  await exigirSessao();
  await new ArchiveNoticiaUseCase(noticiaRepository).execute({ id });
  revalidatePath(CAMINHO_LISTA);
  redirect(CAMINHO_LISTA);
}
