/**
 * Configuração central da aplicação.
 *
 * Centraliza valores que hoje são fixos, mas que tendem a variar entre
 * ambientes (dev/staging/produção) ou evoluir conforme o roadmap
 * (02.05 - Plano de Evolução Técnica). Nenhum módulo deve ler
 * `process.env` diretamente fora deste arquivo — isso mantém uma única
 * fonte de verdade para configuração, conforme os Princípios de Produto
 * (01.10, item 5 - Arquitetura antes do código).
 */

export const appConfig = {
  nome: "Mercatto News",
  descricaoCurta:
    "Inteligência empresarial e desenvolvimento regional do Sul do Brasil.",
  urlBase: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ambiente: process.env.NODE_ENV ?? "development",
} as const;

export const authConfig = {
  // Duração da sessão em segundos (30 dias)
  sessaoMaxAgeSegundos: 60 * 60 * 24 * 30,
} as const;

export const uploadConfig = {
  // Fase 1 (MVP): armazenamento em disco local na Hostinger.
  // Fase 8 (Escalabilidade): migração planejada para Cloudflare R2.
  diretorioMidia: "public/uploads",
  tamanhoMaximoMB: 10,
  formatosPermitidos: ["image/jpeg", "image/png", "image/webp"],
  qualidadeWebp: 80,
} as const;

export const cacheConfig = {
  // Decisão do PO: apenas mecanismos nativos do Next.js nesta fase.
  // Redis está previsto somente na Fase 8 (02.05).
  revalidateHomeSegundos: 60,
  revalidateNoticiaSegundos: 300,
  revalidateEmpresaSegundos: 600,
} as const;

export const seoConfig = {
  tituloPadrao:
    "Mercatto News | Inteligência Empresarial e Desenvolvimento Regional",
  localidadePadrao: "pt_BR",
} as const;
