/**
 * Entidade de domínio: Noticia.
 *
 * Representa as "Notícias" do Mercatto News (Gestão Editorial /
 * Página da Notícia, 01.03.1 §4 e §12). Contém apenas o formato e as
 * regras da entidade — nenhuma dependência de Prisma, Next.js ou UI.
 */

export type StatusNoticia =
  | "RASCUNHO"
  | "EM_EDICAO"
  | "REVISAO"
  | "AGUARDANDO_APROVACAO"
  | "AGENDADA"
  | "PUBLICADA"
  | "ARQUIVADA";

export type TipoConteudo =
  "NOTICIA" | "ARTIGO" | "ENTREVISTA" | "REPORTAGEM_ESPECIAL";

export interface Noticia {
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

/**
 * Dados necessários para criar ou atualizar uma Notícia, antes da
 * geração automática de slug e timestamps. Reflete somente o formato
 * dos dados — regras de transição de status/workflow pertencem à
 * camada de aplicação (use cases), fora do escopo desta etapa.
 */
export interface DadosNoticia {
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
