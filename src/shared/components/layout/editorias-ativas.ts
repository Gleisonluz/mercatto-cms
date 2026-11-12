import { cache } from "react";

import { listarEditorias } from "@/modules/editorial/infrastructure/editoria.repository";

/**
 * Editorias ativas para o menu e o rodapé públicos — Redesign, Fase 1.
 *
 * Reaproveita `listarEditorias()` e filtra por `ativo` na apresentação
 * (mesma seleção que o `PublicHeader` já fazia). O `cache()` do React
 * garante uma única consulta por renderização, mesmo com cabeçalho e
 * rodapé pedindo a lista. Não altera o repositório nem cria regra de
 * negócio nova.
 */
export const obterEditoriasAtivas = cache(async () => {
  const editorias = await listarEditorias();
  return editorias.filter((editoria) => editoria.ativo);
});
