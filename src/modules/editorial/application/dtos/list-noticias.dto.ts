import type { StatusNoticia } from "@/modules/editorial/domain/entities/noticia.entity";
import type { NoticiaDTO } from "@/modules/editorial/application/dtos/noticia-output.dto";
import type { ParametrosPaginacao } from "@/shared/types/pagination";

/**
 * DTO de entrada: filtros e paginação para listagem de Notícias.
 * Contrato real (múltiplos campos opcionais) — justifica um arquivo
 * dedicado.
 */
export interface ListNoticiasDTO {
  status?: StatusNoticia;
  editoriaId?: string;
  apenasDestaques?: boolean;
  apenasPublicadas?: boolean;
  paginacao?: ParametrosPaginacao;
}

/**
 * DTO de saída: resultado paginado de Notícias.
 */
export interface ListNoticiasResultDTO {
  itens: NoticiaDTO[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}
