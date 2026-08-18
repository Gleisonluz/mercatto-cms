import type { Papel } from "@/modules/usuarios/domain/entities/usuario.entity";

/**
 * DTO de entrada: dados necessários para criar um Usuário.
 * Espelha exatamente `DadosCriacaoUsuario` (Sprint 4.1), o contrato
 * já aceito por `CriarUsuarioUseCase` (Sprint 4.2) — nenhum campo
 * inventado.
 *
 * `senha` existe aqui apenas como dado de ENTRADA. Nunca deve
 * aparecer em nenhum DTO de saída (`UsuarioDTO`/`UsuarioListagemDTO`
 * não possuem esse campo).
 */
export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
  avatarUrl?: string | null;
  ativo?: boolean;
}
