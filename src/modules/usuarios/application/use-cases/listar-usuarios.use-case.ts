import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";

export interface ListarUsuariosInput {
  paginacao?: ParametrosPaginacao;
}

/**
 * Caso de uso: listar usuários, paginado.
 * A ordenação (por nome, A-Z) já é responsabilidade do repository
 * (Sprint 4.1) — este Use Case não duplica essa regra.
 */
export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(
    input: ListarUsuariosInput = {},
  ): Promise<ResultadoPaginado<Usuario>> {
    return this.usuarioRepository.listarTodos(input.paginacao);
  }
}
