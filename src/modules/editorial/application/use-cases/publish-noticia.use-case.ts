import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";
import { NoticiaNaoEncontradaError } from "@/modules/editorial/application/use-cases/errors";

export interface PublishNoticiaInput {
  id: string;
  /** Data/hora de publicação. Quando omitida, usa o momento atual. */
  publicadoEm?: Date;
}

/**
 * Caso de uso: publicar uma Notícia (transição de status para
 * `PUBLICADA`).
 *
 * Regras de transição mais restritivas (ex.: impedir publicar uma
 * notícia arquivada sem antes desarquivá-la) dependem do fluxo
 * editorial completo, ainda não especificado — não assumidas aqui
 * (Regra nº 5 do README: nunca assumir).
 */
export class PublishNoticiaUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: PublishNoticiaInput): Promise<Noticia> {
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
      status: "PUBLICADA",
      imagemDestaqueUrl: existente.imagemDestaqueUrl,
      imagemDestaqueAlt: existente.imagemDestaqueAlt,
      imagemDestaqueCredito: existente.imagemDestaqueCredito,
      destaque: existente.destaque,
      ordemDestaque: existente.ordemDestaque,
      tempoLeituraMinutos: existente.tempoLeituraMinutos,
      seoTitle: existente.seoTitle,
      seoDescription: existente.seoDescription,
      seoCanonicalUrl: existente.seoCanonicalUrl,
      publicadoEm: input.publicadoEm ?? new Date(),
      agendadoPara: existente.agendadoPara,
      editoriaId: existente.editoriaId,
      autorId: existente.autorId,
      editorResponsavelId: existente.editorResponsavelId,
    });
  }
}
