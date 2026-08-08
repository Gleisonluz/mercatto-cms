import type {
  StatusNoticia,
  TipoConteudo,
} from "@/modules/editorial/domain/entities/noticia.entity";

/**
 * DTO de entrada: dados necessários para criar uma Notícia.
 * Contrato real (múltiplos campos) — justifica um arquivo dedicado,
 * diferente de operações que recebem apenas um identificador.
 */
export interface CreateNoticiaDTO {
  titulo: string;
  slug?: string;
  linhaFina?: string | null;
  resumo?: string | null;
  conteudo: string;
  tipo?: TipoConteudo;
  status?: StatusNoticia;
  imagemDestaqueUrl?: string | null;
  imagemDestaqueAlt?: string | null;
  imagemDestaqueCredito?: string | null;
  destaque?: boolean;
  ordemDestaque?: number | null;
  tempoLeituraMinutos?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoCanonicalUrl?: string | null;
  publicadoEm?: Date | null;
  agendadoPara?: Date | null;
  editoriaId: string;
  autorId: string;
  editorResponsavelId?: string | null;
}
