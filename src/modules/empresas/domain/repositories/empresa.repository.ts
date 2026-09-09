import type {
  DadosEmpresa,
  Empresa,
} from "@/modules/empresas/domain/entities/empresa.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";

export interface IEmpresaRepository {
  criar(dados: DadosEmpresa & { slug: string }): Promise<Empresa>;

  atualizar(
    id: string,
    dados: DadosEmpresa & { slug: string },
  ): Promise<Empresa>;

  obterPorId(id: string): Promise<Empresa | null>;

  obterPorSlug(slug: string): Promise<Empresa | null>;

  slugJaExiste(slug: string, ignorarId?: string): Promise<boolean>;

  listarTodos(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Empresa>>;

  desativar(id: string): Promise<Empresa>;

  reativar(id: string): Promise<Empresa>;
}