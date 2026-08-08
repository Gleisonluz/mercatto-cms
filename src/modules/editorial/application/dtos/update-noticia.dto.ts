import type { CreateNoticiaDTO } from "@/modules/editorial/application/dtos/create-noticia.dto";

/**
 * DTO de entrada: dados necessários para atualizar uma Notícia.
 * Mesmo contrato de `CreateNoticiaDTO`, acrescido do identificador
 * do registro a ser atualizado.
 */
export interface UpdateNoticiaDTO extends CreateNoticiaDTO {
  id: string;
}
