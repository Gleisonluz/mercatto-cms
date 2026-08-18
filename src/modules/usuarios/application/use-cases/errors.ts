/**
 * Erros de domínio do módulo Usuário, usados pelos Use Cases.
 * Mesmo padrão já estabelecido em
 * `modules/editorial/application/use-cases/errors.ts` (Sprint 3.3).
 */
export class UsuarioNaoEncontradoError extends Error {
  constructor(id: string) {
    super(`Usuário não encontrado: ${id}`);
    this.name = "UsuarioNaoEncontradoError";
  }
}

export class EmailJaExisteError extends Error {
  constructor(email: string) {
    super(`Já existe um usuário cadastrado com o e-mail ${email}.`);
    this.name = "EmailJaExisteError";
  }
}
