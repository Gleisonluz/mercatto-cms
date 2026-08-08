export type { NoticiaDTO } from "./noticia-output.dto";
export type { CreateNoticiaDTO } from "./create-noticia.dto";
export type { UpdateNoticiaDTO } from "./update-noticia.dto";
export type {
  ListNoticiasDTO,
  ListNoticiasResultDTO,
} from "./list-noticias.dto";
export type { PublishNoticiaDTO } from "./publish-noticia.dto";

/**
 * Operações que recebem apenas um identificador (GetById, GetBySlug,
 * Delete, Archive) não possuem DTO dedicado — usam parâmetros simples
 * (`id: string` / `slug: string`) quando a integração ocorrer,
 * conforme decisão arquitetural desta etapa.
 */
