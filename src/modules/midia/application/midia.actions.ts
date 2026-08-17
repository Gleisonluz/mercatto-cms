"use server";

import { auth } from "@/shared/lib/auth";
import { acessoAdminPorPapel } from "@/shared/config/roles.config";
import { ProcessarImagemDestaqueUseCase } from "@/modules/midia/application/processar-imagem-destaque.use-case";

export type EstadoUploadImagem =
  | {
      status: "sucesso";
      url: string;
      largura: number;
      altura: number;
      tamanhoBytes: number;
    }
  | { status: "erro"; mensagem: string };

/**
 * Garante sessão ativa E papel autorizado antes de processar
 * qualquer upload.
 *
 * O upload de imagem de destaque é parte do fluxo de
 * criação/edição de notícia — por isso reutiliza exatamente a mesma
 * lista de papéis já autorizada para `/noticias` em
 * `shared/config/roles.config.ts` (fonte única de verdade de RBAC do
 * projeto), em vez de definir uma nova lista de permissões aqui.
 *
 * Como esta é uma Server Action (não uma API Route), a autenticação
 * não depende do matcher do `middleware.ts` — por isso a Server
 * Action precisa da própria defesa, mesmo padrão de
 * `exigirSessao()` já usado em `noticia.actions.ts`/`editoria.actions.ts`,
 * agora também com verificação de papel.
 */
async function exigirSessaoComPermissaoDeNoticia() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sessão inválida ou expirada.");
  }

  const papeisPermitidos = acessoAdminPorPapel["/noticias"];
  if (!papeisPermitidos.includes(session.user.role as never)) {
    throw new Error(
      "Seu perfil não tem permissão para enviar imagens de notícias.",
    );
  }

  return session;
}

export async function uploadImagemDestaqueAction(
  formData: FormData,
): Promise<EstadoUploadImagem> {
  try {
    await exigirSessaoComPermissaoDeNoticia();

    const arquivo = formData.get("arquivo");
    if (!(arquivo instanceof File)) {
      return { status: "erro", mensagem: "Nenhum arquivo enviado." };
    }

    const buffer = Buffer.from(await arquivo.arrayBuffer());

    const resultado = await new ProcessarImagemDestaqueUseCase().execute({
      buffer,
      mimeType: arquivo.type,
      tamanhoBytes: arquivo.size,
    });

    return {
      status: "sucesso",
      url: resultado.url,
      largura: resultado.largura,
      altura: resultado.altura,
      tamanhoBytes: resultado.tamanhoBytes,
    };
  } catch (erro) {
    return {
      status: "erro",
      mensagem:
        erro instanceof Error ? erro.message : "Erro ao enviar imagem.",
    };
  }
}
