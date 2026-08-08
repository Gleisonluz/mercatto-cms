import type {
  StatusNoticia,
  TipoConteudo,
} from "@/modules/editorial/domain/entities/noticia.entity";

/**
 * DTO de saída: formato de representação de uma Notícia entre a
 * camada de aplicação e seus consumidores (Service/Controller,
 * quando existirem). Espelha a entidade de domínio — é o contrato
 * público, desacoplado da entidade interna.
 */
export interface NoticiaDTO {
  id: string;
  titulo: string;
  slug: string;
  linhaFina: string | null;
  resumo: string | null;
  conteudo: string;
  tipo: TipoConteudo;
  status: StatusNoticia;
  imagemDestaqueUrl: string | null;
  imagemDestaqueAlt: string | null;
  imagemDestaqueCredito: string | null;
  destaque: boolean;
  ordemDestaque: number | null;
  visualizacoes: number;
  tempoLeituraMinutos: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonicalUrl: string | null;
  publicadoEm: Date | null;
  agendadoPara: Date | null;
  criadoEm: Date;
  atualizadoEm: Date;
  editoriaId: string;
  autorId: string;
  editorResponsavelId: string | null;
}
