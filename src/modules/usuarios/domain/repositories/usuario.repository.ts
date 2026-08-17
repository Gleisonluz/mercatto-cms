import type {
  DadosAtualizacaoUsuario,
  DadosCriacaoUsuario,
  Usuario,
} from "@/modules/usuarios/domain/entities/usuario.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";

/**
 * Contrato do repositório de Usuário (Dependency Inversion — SOLID),
 * mesmo padrão já estabelecido por `INoticiaRepository` (Sprint 3.2).
 *
 * Nenhum método deste contrato retorna `senhaHash` — os tipos de
 * retorno (`Usuario`) já excluem esse campo por construção (ver
 * `domain/entities/usuario.entity.ts`).
 *
 * Não existe `excluir()`: usuários nunca são apagados fisicamente,
 * apenas desativados (campo `ativo`), preservando a integridade das
 * relações já existentes com `Noticia` (`autor`/`editorResponsavel`,
 * ambas `onDelete: Restrict`/`SetNull` no schema, nunca cascade).
 */
export interface IUsuarioRepository {
  criar(dados: DadosCriacaoUsuario): Promise<Usuario>;

  atualizar(id: string, dados: DadosAtualizacaoUsuario): Promise<Usuario>;

  obterPorId(id: string): Promise<Usuario | null>;

  obterPorEmail(email: string): Promise<Usuario | null>;

  emailJaExiste(email: string, ignorarId?: string): Promise<boolean>;

  listarTodos(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Usuario>>;

  /** Desativação lógica — usuário mantém todo o histórico associado. */
  desativar(id: string): Promise<Usuario>;

  reativar(id: string): Promise<Usuario>;
}
