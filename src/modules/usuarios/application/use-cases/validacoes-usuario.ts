/**
 * Validações de negócio compartilhadas por `CriarUsuarioUseCase` e
 * `AtualizarUsuarioUseCase`. Guard clauses simples (sem Zod) — a
 * validação formal via schema fica para a Sprint de DTOs/Validators,
 * fora do escopo desta etapa (mesmo padrão já usado nos Use Cases de
 * Notícia, Sprint 3.3).
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regra mínima de senha do projeto: 8 caracteres. Não havia regra
 * formal documentada até esta Sprint — este é o mesmo mínimo já
 * usado (de forma solta) no formulário de login e em `loginSchema`
 * (Sprint 1), agora formalizado como regra de negócio na criação e
 * alteração de usuários.
 */
const TAMANHO_MINIMO_SENHA = 8;

export function validarNome(nome: string): void {
  if (!nome?.trim()) {
    throw new Error("O nome do usuário é obrigatório.");
  }
}

export function validarEmail(email: string): void {
  if (!email?.trim()) {
    throw new Error("O e-mail do usuário é obrigatório.");
  }
  if (!REGEX_EMAIL.test(email)) {
    throw new Error("Informe um e-mail válido.");
  }
}

export function validarSenha(senha: string): void {
  if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
    throw new Error(
      `A senha deve possuir ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
    );
  }
}
