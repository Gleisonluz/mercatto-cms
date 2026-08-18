import type { Papel, Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";

/**
 * DTO de saída: formato de representação de um Usuário entre a
 * camada de aplicação e seus consumidores (Service/Controller,
 * quando existirem).
 *
 * NUNCA inclui `senhaHash`, `senha` ou qualquer segredo de
 * autenticação — esta é a regra de segurança mais importante desta
 * Sprint.
 */
export interface UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  avatarUrl: string | null;
  ultimoAcesso: Date | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Mapeamento explícito, campo a campo — deliberadamente não é um
 * `return usuario`/spread. A entidade de domínio `Usuario` já exclui
 * `senhaHash` por construção (Sprint 4.1), então este mapeamento não
 * é estritamente necessário para a segurança hoje — mas funciona
 * como uma segunda barreira: se a entidade algum dia ganhar um campo
 * sensível, uma lista explícita como esta não o propagaria
 * automaticamente, enquanto um spread propagaria.
 */
export function paraUsuarioDTO(usuario: Usuario): UsuarioDTO {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
    ativo: usuario.ativo,
    avatarUrl: usuario.avatarUrl,
    ultimoAcesso: usuario.ultimoAcesso,
    criadoEm: usuario.criadoEm,
    atualizadoEm: usuario.atualizadoEm,
  };
}
