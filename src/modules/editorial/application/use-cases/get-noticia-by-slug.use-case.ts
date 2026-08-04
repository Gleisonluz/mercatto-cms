import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";

export interface GetNoticiaBySlugInput {
  slug: string;
}

/**
 * Caso de uso: obter uma Notícia pelo slug (usado pela página pública
 * da notícia, quando implementada — fora do escopo desta etapa).
 *
 * Retorna `null` quando não encontrada.
 */
export class GetNoticiaBySlugUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: GetNoticiaBySlugInput): Promise<Noticia | null> {
    return this.noticiaRepository.obterPorSlug(input.slug);
  }
}
