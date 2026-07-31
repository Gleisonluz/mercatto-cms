/**
 * Entidade de domínio: Editoria.
 *
 * Representa as "Editorias" do Mercatto News (organização editorial,
 * 01.03.1 seção 7). Contém apenas o formato e as regras da entidade —
 * nenhuma dependência de Prisma, Next.js ou UI.
 */
export interface Editoria {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  cor: string | null;
  icone: string | null;
  imagemCapaUrl: string | null;
  ordem: number;
  ativo: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Dados necessários para criar ou atualizar uma Editoria,
 * antes da geração automática de slug e timestamps.
 */
export interface DadosEditoria {
  nome: string;
  slug?: string;
  descricao?: string | null;
  cor?: string | null;
  icone?: string | null;
  imagemCapaUrl?: string | null;
  ordem?: number;
  ativo?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}
