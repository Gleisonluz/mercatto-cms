/**
 * Tipos genéricos de paginação, reutilizáveis por qualquer módulo
 * (Notícia, e futuramente Empresas, etc.). Não contém lógica de
 * negócio nem dependência de framework — apenas formato de dados.
 */
export interface ParametrosPaginacao {
  pagina?: number;
  itensPorPagina?: number;
}

export interface ResultadoPaginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

/**
 * Normaliza parâmetros de paginação recebidos (garante valores
 * mínimos válidos), evitando duplicar essa checagem em cada
 * repositório que implementar paginação.
 */
export function normalizarPaginacao(
  parametros?: ParametrosPaginacao,
): Required<ParametrosPaginacao> {
  const pagina = Math.max(1, parametros?.pagina ?? 1);
  const itensPorPagina = Math.min(
    100,
    Math.max(1, parametros?.itensPorPagina ?? 10),
  );
  return { pagina, itensPorPagina };
}
