import type { Papel, Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";

/**
 * DTO de listagem: formato enxuto de Usuário para telas de lista —
 * deliberadamente sem `atualizadoEm` (não é útil numa listagem,
 * diferente da visão de detalhe/edição em `UsuarioDTO`). Nunca
 * inclui `senhaHash`/`senha`.
 */
export interface UsuarioListagemDTO {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  avatarUrl: string | null;
  ultimoAcesso: Date | null;
  criadoEm: Date;
}

/**
 * DTO de saída: resultado paginado de Usuários. Segue exatamente a
 * mesma convenção de paginação já usada em `ListNoticiasResultDTO`
 * (`itens`, `total`, `pagina`, `itensPorPagina`, `totalPaginas`) —
 * não introduz um padrão novo.
 */
export interface ListagemUsuariosResultDTO {
  itens: UsuarioListagemDTO[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

/** Mapeamento explícito, campo a campo — mesmo critério de `paraUsuarioDTO`. */
export function paraUsuarioListagemDTO(usuario: Usuario): UsuarioListagemDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
    ativo: usuario.ativo,
    avatarUrl: usuario.avatarUrl,
    ultimoAcesso: usuario.ultimoAcesso,
    criadoEm: usuario.criadoEm,
  };
}
