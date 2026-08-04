import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type {
  Noticia,
  StatusNoticia,
} from "@/modules/editorial/domain/entities/noticia.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";
import { FiltroDeListagemAusenteError } from "@/modules/editorial/application/use-cases/errors";

export interface ListNoticiasInput {
  status?: StatusNoticia;
  editoriaId?: string;
  apenasDestaques?: boolean;
  apenasPublicadas?: boolean;
  paginacao?: ParametrosPaginacao;
}

/**
 * Caso de uso: listar notícias segundo um filtro.
 *
 * O repositório (Sprint 3.2) expõe métodos de listagem específicos
 * (`listarPorStatus`, `listarPorEditoria`, `listarDestaques`,
 * `listarPublicadas`), sem um "listar todas" genérico. Este Use Case
 * despacha para o método correspondente ao filtro informado.
 *
 * Ordem de precedência quando mais de um filtro é informado:
 * `apenasDestaques` > `apenasPublicadas` > `status` > `editoriaId`.
 * Se nenhum filtro for informado, lança `FiltroDeListagemAusenteError`
 * em vez de assumir um comportamento não especificado.
 */
export class ListNoticiasUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: ListNoticiasInput): Promise<ResultadoPaginado<Noticia>> {
    if (input.apenasDestaques) {
      return this.noticiaRepository.listarDestaques(input.paginacao);
    }

    if (input.apenasPublicadas) {
      return this.noticiaRepository.listarPublicadas(input.paginacao);
    }

    if (input.status) {
      return this.noticiaRepository.listarPorStatus(
        input.status,
        input.paginacao,
      );
    }

    if (input.editoriaId) {
      return this.noticiaRepository.listarPorEditoria(
        input.editoriaId,
        input.paginacao,
      );
    }

    throw new FiltroDeListagemAusenteError();
  }
}
