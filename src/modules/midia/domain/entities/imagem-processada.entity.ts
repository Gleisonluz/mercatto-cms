/**
 * Entidade de domínio: resultado do processamento de uma imagem
 * enviada por upload. Não depende de sharp, Next.js ou sistema de
 * arquivos — apenas o formato do resultado.
 */
export interface ImagemProcessada {
  url: string;
  largura: number;
  altura: number;
  tamanhoBytes: number;
  formato: string;
}
