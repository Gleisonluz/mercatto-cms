import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import { NoticiaNaoEncontradaError } from "@/modules/editorial/application/use-cases/errors";

export interface DeleteNoticiaInput {
  id: string;
}

/**
 * Caso de uso: excluir uma Notícia existente.
 *
 * Depende apenas da interface `INoticiaRepository`.
 */
export class DeleteNoticiaUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: DeleteNoticiaInput): Promise<void> {
    const existente = await this.noticiaRepository.obterPorId(input.id);
    if (!existente) {
      throw new NoticiaNaoEncontradaError(input.id);
    }

    await this.noticiaRepository.excluir(input.id);
  }
}
