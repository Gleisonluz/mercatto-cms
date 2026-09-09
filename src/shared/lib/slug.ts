/**
 * Geração de slug a partir de um texto.
 *
 * Regras:
 * - minúsculas
 * - remove acentos
 * - troca espaços e caracteres especiais por hífen
 * - remove hífens duplicados/nas pontas
 */
export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}