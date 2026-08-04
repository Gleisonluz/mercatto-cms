/**
 * Erros de domínio do módulo Notícia, usados pelos Use Cases.
 * Ficam dentro de `application/use-cases` (escopo desta etapa) e não
 * dependem de nenhum framework — podem ser capturados por qualquer
 * camada consumidora (Service, Controller, Server Action) no futuro.
 */
export class NoticiaNaoEncontradaError extends Error {
  constructor(id: string) {
    super(`Notícia não encontrada: ${id}`);
    this.name = "NoticiaNaoEncontradaError";
  }
}

export class FiltroDeListagemAusenteError extends Error {
  constructor() {
    super(
      "Informe ao menos um filtro para listar notícias (status, editoriaId, apenasDestaques ou apenasPublicadas).",
    );
    this.name = "FiltroDeListagemAusenteError";
  }
}
