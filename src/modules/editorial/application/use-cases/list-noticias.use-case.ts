import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type {
  Noticia,
  StatusNoticia,
} from "@/modules/editorial/domain/entities/noticia.entity";
import type {
  ParametrosPaginacao,
  ResultadoPaginado,
} from "@/shared/types/pagination";

export interface ListNoticiasInput {
  status?: StatusNoticia;
  editoriaId?: string;
  apenasDestaques?: boolean;
  apenasPublicadas?: boolean;
  paginacao?: ParametrosPaginacao;
}

/**
 * Caso de uso: listar notícias, com filtro opcional.
 *
 * O repositório (Sprint 3.2, ampliado nas Sprints 3.5 e 6) expõe
 * métodos de listagem específicos (`listarPorStatus`,
 * `listarPorEditoria`, `listarDestaques`, `listarPublicadas`,
 * `listarPublicadasPorEditoria`) e um `listarTodas` genérico. Este
 * Use Case despacha para o método correspondente ao(s) filtro(s)
 * informado(s).
 *
 * Ordem de precedência:
 * `apenasDestaques` > (`apenasPublicadas` + `editoriaId` juntos) >
 * `apenasPublicadas` > `status` > `editoriaId`.
 *
 * O caso combinado (`apenasPublicadas` + `editoriaId`) é verificado
 * antes do `apenasPublicadas` isolado — do contrário, `editoriaId`
 * seria descartado silenciosamente (lacuna identificada na Sprint 6,
 * necessária para a listagem pública por editoria mostrar somente
 * notícias publicadas daquela editoria, sem duplicar a regra de "o
 * que é publicado" na camada de apresentação).
 *
 * Se nenhum filtro for informado, lista todas as notícias
 * (comportamento padrão de uma tela principal de CMS — decisão da
 * Sprint 3.5, que substitui o comportamento anterior de lançar erro).
 */
export class ListNoticiasUseCase {
  constructor(private readonly noticiaRepository: INoticiaRepository) {}

  async execute(input: ListNoticiasInput): Promise<ResultadoPaginado<Noticia>> {
    if (input.apenasDestaques) {
      return this.noticiaRepository.listarDestaques(input.paginacao);
    }

    if (input.apenasPublicadas && input.editoriaId) {
      return this.noticiaRepository.listarPublicadasPorEditoria(
        input.editoriaId,
        input.paginacao,
      );
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

    return this.noticiaRepository.listarTodas(input.paginacao);
  }
}
