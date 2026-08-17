/**
 * Entidade de domínio: Usuario.
 *
 * IMPORTANTE: esta entidade deliberadamente NÃO inclui `senhaHash`.
 * O hash de senha nunca deve trafegar para camadas de apresentação
 * ou casos de uso que não sejam estritamente os de criação/alteração
 * de senha — essa é uma decisão de segurança desta Sprint, não um
 * esquecimento. Operações que precisam do hash (login, definição de
 * senha) ficam isoladas na camada de infraestrutura.
 */
export type Papel =
  | "SUPER_ADMINISTRADOR"
  | "ADMINISTRADOR"
  | "EDITOR_CHEFE"
  | "EDITOR"
  | "JORNALISTA"
  | "COLUNISTA"
  | "FOTOGRAFO"
  | "COMERCIAL";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  avatarUrl: string | null;
  ativo: boolean;
  ultimoAcesso: Date | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Dados necessários para criar um usuário. `senha` aqui é a senha em
 * texto puro informada no formulário — o hash é responsabilidade
 * exclusiva da camada de infraestrutura (`infrastructure/usuario.repository.ts`),
 * usando exatamente o mesmo mecanismo já usado em `auth.ts`/`seed.ts`
 * (bcryptjs, 10 salt rounds).
 */
export interface DadosCriacaoUsuario {
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
  avatarUrl?: string | null;
  ativo?: boolean;
}

/**
 * Dados para atualização de um usuário já existente. `senha` é
 * opcional — quando omitida, a senha atual permanece inalterada.
 */
export interface DadosAtualizacaoUsuario {
  nome: string;
  email: string;
  papel: Papel;
  avatarUrl?: string | null;
  ativo?: boolean;
  senha?: string;
}
