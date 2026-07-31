/**
 * Geração de slug a partir de um texto (ex.: nome da editoria).
 * Função pura de domínio — não depende de framework, banco ou UI.
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
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .replace(/\s+/g, "-") // espaços -> hífen
    .replace(/-+/g, "-") // colapsa hífens repetidos
    .replace(/^-+|-+$/g, ""); // remove hífens nas pontas
}
