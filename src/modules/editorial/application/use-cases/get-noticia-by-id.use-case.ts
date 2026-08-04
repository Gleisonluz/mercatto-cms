import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";

export interface GetNoticiaByIdInput {
  id: string;
}

/**
 * Caso de uso: obter uma Notícia pelo id.
 *
 * Retorna `null` quando não encontrada — a decisão de tratar isso
 * como 404, erro ou outro comportamento cabe à camada que consumir
 * este Use Case (Service/Controller), fora do escopo desta etapa.
 */
export class GetNoticiaByIdUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: GetNoticiaByIdInput): Promise<Noticia | null> {
    return this.noticiaRepository.obterPorId(input.id);
  }
}
