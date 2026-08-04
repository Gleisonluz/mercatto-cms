import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type {
  DadosNoticia,
  Noticia,
} from "@/modules/editorial/domain/entities/noticia.entity";
import { resolverSlugUnicoNoticia } from "@/modules/editorial/application/use-cases/resolver-slug-unico-noticia";

export type CreateNoticiaInput = DadosNoticia;

/**
 * Caso de uso: criar uma nova Notícia.
 *
 * Depende apenas da interface `INoticiaRepository` (Dependency
 * Inversion) — nenhum acesso direto ao Prisma, Next.js, controllers
 * ou rotas.
 */
export class CreateNoticiaUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: CreateNoticiaInput): Promise<Noticia> {
    if (!input.titulo?.trim()) {
      throw new Error("O título da notícia é obrigatório.");
    }
    if (!input.conteudo?.trim()) {
      throw new Error("O conteúdo da notícia é obrigatório.");
    }
    if (!input.editoriaId) {
      throw new Error("A editoria da notícia é obrigatória.");
    }
    if (!input.autorId) {
      throw new Error("O autor da notícia é obrigatório.");
    }

    const slug = await resolverSlugUnicoNoticia(
      this.noticiaRepository,
      input.titulo,
      input.slug,
    );

    return this.noticiaRepository.criar({ ...input, slug });
  }
}
