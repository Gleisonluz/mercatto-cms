import { randomUUID } from "node:crypto";

/**
 * Gera uma chave de armazenamento única e segura para um arquivo de
 * mídia. Nunca deriva do nome original enviado pelo usuário — isso
 * elimina, por construção, qualquer risco de path traversal ou de
 * colisão de nomes (requisito de segurança da Sprint 3.6).
 */
export function gerarChaveArmazenamento(extensao: string): string {
  return `${randomUUID()}.${extensao}`;
}
