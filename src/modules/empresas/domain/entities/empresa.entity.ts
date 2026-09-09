export type StatusEmpresa = "ATIVA" | "INATIVA";

export interface Empresa {
  id: string;
  nomeEmpresarial: string;
  slug: string;
  logotipoUrl: string | null;
  fotografiaCapaUrl: string | null;
  segmentoAtuacao: string | null;
  cidade: string | null;
  estado: string | null;
  descricaoInstitucional: string | null;
  siteOficial: string | null;
  redesSociais: string | null;
  contatos: string | null;
  localizacao: string | null;
  selosCertificacoes: string | null;
  esg: string | null;
  status: StatusEmpresa;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface DadosEmpresa {
  nomeEmpresarial: string;
  slug?: string;
  logotipoUrl?: string | null;
  fotografiaCapaUrl?: string | null;
  segmentoAtuacao?: string | null;
  cidade?: string | null;
  estado?: string | null;
  descricaoInstitucional?: string | null;
  siteOficial?: string | null;
  redesSociais?: string | null;
  contatos?: string | null;
  localizacao?: string | null;
  selosCertificacoes?: string | null;
  esg?: string | null;
  status?: StatusEmpresa;
}