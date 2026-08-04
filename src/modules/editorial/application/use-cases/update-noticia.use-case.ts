import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type {
  DadosNoticia,
  Noticia,
} from "@/modules/editorial/domain/entities/noticia.entity";
import { resolverSlugUnicoNoticia } from "@/modules/editorial/application/use-cases/resolver-slug-unico-noticia";
import { NoticiaNaoEncontradaError } from "@/modules/editorial/application/use-cases/errors";

export interface UpdateNoticiaInput extends DadosNoticia {
  id: string;
}

/**
 * Caso de uso: atualizar uma Notícia existente.
 *
 * Depende apenas da interface `INoticiaRepository`.
 */
export class UpdateNoticiaUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: UpdateNoticiaInput): Promise<Noticia> {
    const existente = await this.noticiaRepository.obterPorId(input.id);
    if (!existente) {
      throw new NoticiaNaoEncontradaError(input.id);
    }

    if (!input.titulo?.trim()) {
      throw new Error("O título da notícia é obrigatório.");
    }
    if (!input.conteudo?.trim()) {
      throw new Error("O conteúdo da notícia é obrigatório.");
    }

    const slug = await resolverSlugUnicoNoticia(
      this.noticiaRepository,
      input.titulo,
      input.slug,
      input.id,
    );

    return this.noticiaRepository.atualizar(input.id, { ...input, slug });
  }
}
