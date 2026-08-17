import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { uploadConfig } from "@/shared/config/app.config";

const SUBPASTA_NOTICIAS = "noticias";

/**
 * Armazenamento local em disco, usando exatamente `uploadConfig.diretorioMidia`
 * (já definido desde o Sprint 1 como `public/uploads`) — Fase 1 do
 * plano de evolução técnica (02.05). Migração para storage externo
 * (Cloudflare R2, Fase 8) fica para quando for autorizada.
 *
 * O nome do arquivo (`nomeArquivo`) é sempre gerado internamente por
 * `gerarChaveArmazenamento` (UUID), nunca vindo do usuário — não há
 * caminho para path traversal, pois nenhuma parte do path é
 * construída a partir de entrada externa.
 */
export async function salvarArquivoLocal(
  buffer: Buffer,
  nomeArquivo: string,
): Promise<{ url: string }> {
  const diretorioAbsoluto = path.join(
    process.cwd(),
    uploadConfig.diretorioMidia,
    SUBPASTA_NOTICIAS,
  );

  await mkdir(diretorioAbsoluto, { recursive: true });

  const caminhoAbsoluto = path.join(diretorioAbsoluto, nomeArquivo);
  await writeFile(caminhoAbsoluto, buffer);

  // `diretorioMidia` já inclui o prefixo "public" — a URL pública é o
  // caminho relativo a partir de "public" (servido estaticamente pelo
  // Next.js).
  const raizPublica = uploadConfig.diretorioMidia.replace(/^public\/?/, "");
  const urlPublica = `/${path.posix.join(raizPublica, SUBPASTA_NOTICIAS, nomeArquivo)}`;

  return { url: urlPublica };
}
