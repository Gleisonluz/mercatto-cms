import type {
  DadosNoticia,
  Noticia,
  StatusNoticia,
} from "@/modules/editorial/domain/entities/noticia.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";

/**
 * Contrato do repositório de Notícia (Dependency Inversion — SOLID).
 *
 * A camada de domínio depende apenas desta interface, nunca da
 * implementação concreta (Prisma). Isso permite substituir a fonte
 * de dados no futuro (ex.: outro ORM, cache, testes com fake
 * repository) sem alterar regras de negócio.
 *
 * Implementação concreta: ver
 * `src/modules/editorial/infrastructure/noticia.repository.ts`.
 */
export interface INoticiaRepository {
  criar(dados: DadosNoticia & { slug: string }): Promise<Noticia>;

  atualizar(
    id: string,
    dados: DadosNoticia & { slug: string },
  ): Promise<Noticia>;

  excluir(id: string): Promise<void>;

  obterPorId(id: string): Promise<Noticia | null>;

  obterPorSlug(slug: string): Promise<Noticia | null>;

  slugJaExiste(slug: string, ignorarId?: string): Promise<boolean>;

  listarPorStatus(
    status: StatusNoticia,
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>>;

  listarPorEditoria(
    editoriaId: string,
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>>;

  /** Notícias com `destaque = true` e `status = PUBLICADA`. */
  listarDestaques(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>>;

  /** Notícias com `status = PUBLICADA`, ordenadas por `publicadoEm` desc. */
  listarPublicadas(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>>;
}
