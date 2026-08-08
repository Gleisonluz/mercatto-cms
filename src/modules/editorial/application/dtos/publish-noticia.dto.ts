/**
 * DTO de entrada: dados para publicar uma Notícia.
 * Carrega um dado real além do identificador (`publicadoEm`
 * opcional), o que justifica um arquivo dedicado — diferente de
 * `Archive`, que opera apenas com o `id`.
 */
export interface PublishNoticiaDTO {
  id: string;
  publicadoEm?: Date;
}
