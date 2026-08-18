import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type {
  DadosAtualizacaoUsuario,
  Usuario,
} from "@/modules/usuarios/domain/entities/usuario.entity";
import {
  validarNome,
  validarEmail,
  validarSenha,
} from "@/modules/usuarios/application/use-cases/validacoes-usuario";
import {
  EmailJaExisteError,
  UsuarioNaoEncontradoError,
} from "@/modules/usuarios/application/use-cases/errors";

export interface AtualizarUsuarioInput extends DadosAtualizacaoUsuario {
  id: string;
}

/**
 * Caso de uso: atualizar dados de um usuário existente.
 *
 * A senha é opcional — quando não informada, a senha atual
 * permanece inalterada (comportamento já implementado no repository,
 * Sprint 4.1). Quando informada, passa pela mesma validação de
 * criação antes de seguir para o hash.
 */
export class AtualizarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: AtualizarUsuarioInput): Promise<Usuario> {
    const existente = await this.usuarioRepository.obterPorId(input.id);
    if (!existente) {
      throw new UsuarioNaoEncontradoError(input.id);
    }

    validarNome(input.nome);
    validarEmail(input.email);
    if (input.senha) {
      validarSenha(input.senha);
    }

    if (!input.papel) {
      throw new Error("O papel do usuário é obrigatório.");
    }

    const emailJaExiste = await this.usuarioRepository.emailJaExiste(
      input.email,
      input.id,
    );
    if (emailJaExiste) {
      throw new EmailJaExisteError(input.email);
    }

    return this.usuarioRepository.atualizar(input.id, input);
  }
}
