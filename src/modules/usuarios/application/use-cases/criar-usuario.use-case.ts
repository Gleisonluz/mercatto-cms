import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type {
  DadosCriacaoUsuario,
  Usuario,
} from "@/modules/usuarios/domain/entities/usuario.entity";
import {
  validarNome,
  validarEmail,
  validarSenha,
} from "@/modules/usuarios/application/use-cases/validacoes-usuario";
import { EmailJaExisteError } from "@/modules/usuarios/application/use-cases/errors";

export type CriarUsuarioInput = DadosCriacaoUsuario;

/**
 * Caso de uso: criar um novo usuário.
 *
 * Depende apenas da interface `IUsuarioRepository` (Dependency
 * Inversion) — nenhum acesso direto ao Prisma. A senha em texto puro
 * só existe até este ponto; o hash é responsabilidade exclusiva do
 * repositório (que reutiliza bcryptjs, mesmo mecanismo de `auth.ts`).
 * O retorno nunca contém `senhaHash` — o tipo `Usuario` já exclui
 * esse campo por construção (Sprint 4.1).
 */
export class CriarUsuarioUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: CriarUsuarioInput): Promise<Usuario> {
    validarNome(input.nome);
    validarEmail(input.email);
    validarSenha(input.senha);

    if (!input.papel) {
      throw new Error("O papel do usuário é obrigatório.");
    }

    const emailJaExiste = await this.usuarioRepository.emailJaExiste(
      input.email,
    );
    if (emailJaExiste) {
      throw new EmailJaExisteError(input.email);
    }

    return this.usuarioRepository.criar(input);
  }
}
