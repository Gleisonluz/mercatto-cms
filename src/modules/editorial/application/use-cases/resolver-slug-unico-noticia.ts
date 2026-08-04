import { gerarSlug } from "@/modules/editorial/domain/value-objects/slug";
import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";

/**
 * Resolve o slug final de uma notícia: usa o informado manualmente
 * (se houver) ou gera automaticamente a partir do título. Garante
 * unicidade adicionando um sufixo numérico em caso de colisão.
 *
 * Helper interno compartilhado por `CreateNoticiaUseCase` e
 * `UpdateNoticiaUseCase` — não é um Use Case por si só, por isso não
 * é exportado no barrel público do módulo.
 */
export async function resolverSlugUnicoNoticia(
  noticiaRepository: INoticiaRepository,
  titulo: string,
  slugInformado: string | undefined,
  ignorarId?: string,
): Promise<string> {
  const base = gerarSlug(slugInformado || titulo);
  let candidato = base;
  let sufixo = 2;

  while (await noticiaRepository.slugJaExiste(candidato, ignorarId)) {
    candidato = `${base}-${sufixo}`;
    sufixo += 1;
  }

  return candidato;
}
