export { type UsuarioDTO, paraUsuarioDTO } from "./usuario.dto";
export {
  type UsuarioListagemDTO,
  type ListagemUsuariosResultDTO,
  paraUsuarioListagemDTO,
} from "./usuario-listagem.dto";
export { type CriarUsuarioDTO } from "./criar-usuario.dto";
export { type AtualizarUsuarioDTO } from "./atualizar-usuario.dto";

/**
 * Não existe um DTO dedicado para "listar usuários" (entrada): o
 * Use Case `ListarUsuariosUseCase` (Sprint 4.2) aceita apenas
 * `{ paginacao?: ParametrosPaginacao }`, sem nenhum filtro adicional
 * — usar `ParametrosPaginacao` (`shared/types/pagination.ts`)
 * diretamente. Criar um DTO só por simetria, sem um contrato real
 * além do já genérico, foi deliberadamente evitado (mesmo critério
 * já aplicado ao módulo de Notícia, Sprint 3.4).
 */
