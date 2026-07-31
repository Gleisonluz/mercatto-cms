/**
 * Papéis oficiais do MVP Essencial (01.03.1), conforme decisão do
 * Product Owner que resolveu o conflito com o documento 01.03 (histórico).
 *
 * Este arquivo é a fonte única de verdade sobre papéis (RBAC) na
 * aplicação. O middleware e os módulos devem sempre importar `Papel`
 * a partir daqui (re-exportado do Prisma Client) em vez de redefinir
 * a lista de perfis em outros pontos do código.
 */
import { Papel } from "@prisma/client";

export { Papel };

/**
 * Rotas administrativas e os papéis autorizados a acessá-las.
 * Usado pelo middleware de proteção (`src/middleware.ts`).
 */
export const acessoAdminPorPapel: Record<string, Papel[]> = {
  "/dashboard": [
    Papel.SUPER_ADMINISTRADOR,
    Papel.ADMINISTRADOR,
    Papel.EDITOR_CHEFE,
    Papel.EDITOR,
    Papel.JORNALISTA,
    Papel.COLUNISTA,
    Papel.FOTOGRAFO,
    Papel.COMERCIAL,
  ],
  "/noticias": [
    Papel.SUPER_ADMINISTRADOR,
    Papel.ADMINISTRADOR,
    Papel.EDITOR_CHEFE,
    Papel.EDITOR,
    Papel.JORNALISTA,
    Papel.COLUNISTA,
  ],
  "/editorias": [
    Papel.SUPER_ADMINISTRADOR,
    Papel.ADMINISTRADOR,
    Papel.EDITOR_CHEFE,
    Papel.EDITOR,
  ],
  "/empresas": [
    Papel.SUPER_ADMINISTRADOR,
    Papel.ADMINISTRADOR,
    Papel.EDITOR_CHEFE,
    Papel.EDITOR,
    Papel.COMERCIAL,
  ],
  "/usuarios": [Papel.SUPER_ADMINISTRADOR, Papel.ADMINISTRADOR],
  "/publicidade": [
    Papel.SUPER_ADMINISTRADOR,
    Papel.ADMINISTRADOR,
    Papel.COMERCIAL,
  ],
  "/configuracoes": [Papel.SUPER_ADMINISTRADOR, Papel.ADMINISTRADOR],
};
