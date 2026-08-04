import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";
import { NoticiaNaoEncontradaError } from "@/modules/editorial/application/use-cases/errors";

export interface ArchiveNoticiaInput {
  id: string;
}

/**
 * Caso de uso: arquivar uma Notícia (transição de status para
 * `ARQUIVADA`).
 */
export class ArchiveNoticiaUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: ArchiveNoticiaInput): Promise<Noticia> {
    const existente = await this.noticiaRepository.obterPorId(input.id);
    if (!existente) {
      throw new NoticiaNaoEncontradaError(input.id);
    }

    return this.noticiaRepository.atualizar(input.id, {
      titulo: existente.titulo,
      slug: existente.slug,
      linhaFina: existente.linhaFina,
      resumo: existente.resumo,
      conteudo: existente.conteudo,
      tipo: existente.tipo,
      status: "ARQUIVADA",
      imagemDestaqueUrl: existente.imagemDestaqueUrl,
      imagemDestaqueAlt: existente.imagemDestaqueAlt,
      imagemDestaqueCredito: existente.imagemDestaqueCredito,
      destaque: existente.destaque,
      ordemDestaque: existente.ordemDestaque,
      tempoLeituraMinutos: existente.tempoLeituraMinutos,
      seoTitle: existente.seoTitle,
      seoDescription: existente.seoDescription,
      seoCanonicalUrl: existente.seoCanonicalUrl,
      publicadoEm: existente.publicadoEm,
      agendadoPara: existente.agendadoPara,
      editoriaId: existente.editoriaId,
      autorId: existente.autorId,
      editorResponsavelId: existente.editorResponsavelId,
    });
  }
}
