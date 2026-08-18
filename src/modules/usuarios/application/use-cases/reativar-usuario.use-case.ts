import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";
import { UsuarioNaoEncontradoError } from "@/modules/usuarios/application/use-cases/errors";

export interface ReativarUsuarioInput {
  id: string;
}

/**
 * Caso de uso: reativar um usuário previamente desativado.
 */
export class ReativarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: ReativarUsuarioInput): Promise<Usuario> {
    const existente = await this.usuarioRepository.obterPorId(input.id);
    if (!existente) {
      throw new UsuarioNaoEncontradoError(input.id);
    }

    return this.usuarioRepository.reativar(input.id);
  }
}
