import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";
import { UsuarioNaoEncontradoError } from "@/modules/usuarios/application/use-cases/errors";

export interface DesativarUsuarioInput {
  id: string;
}

/**
 * Caso de uso: desativar um usuário (desativação lógica via campo
 * `ativo`). Nunca exclui fisicamente — preserva a integridade das
 * relações existentes com `Noticia` (autor/editor responsável).
 */
export class DesativarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: DesativarUsuarioInput): Promise<Usuario> {
    const existente = await this.usuarioRepository.obterPorId(input.id);
    if (!existente) {
      throw new UsuarioNaoEncontradoError(input.id);
    }

    return this.usuarioRepository.desativar(input.id);
  }
}
