import type { Papel } from "@/modules/usuarios/domain/entities/usuario.entity";

/**
 * DTO de entrada: dados para atualizar um Usuário existente.
 * Espelha exatamente `AtualizarUsuarioInput` (Sprint 4.2).
 *
 * `nome`, `email` e `papel` são obrigatórios porque
 * `AtualizarUsuarioUseCase` não suporta atualização parcial desses
 * três campos hoje — o DTO não inventa uma opcionalidade que o Use
 * Case não aceita. `avatarUrl`, `ativo` e `senha` são opcionais,
 * assim como no Use Case.
 *
 * `senha` é opcional: quando omitida, a senha atual permanece
 * inalterada (comportamento já implementado no repository, Sprint
 * 4.1). Nunca deve aparecer em nenhum DTO de saída.
 */
export interface AtualizarUsuarioDTO {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  avatarUrl?: string | null;
  ativo?: boolean;
  senha?: string;
}
