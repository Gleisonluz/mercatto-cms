import sharp from "sharp";

import { uploadConfig } from "@/shared/config/app.config";
import { validarArquivoImagem } from "@/modules/midia/domain/validacao-upload";
import { gerarChaveArmazenamento } from "@/modules/midia/domain/value-objects/storage-key";
import { salvarArquivoLocal } from "@/modules/midia/infrastructure/armazenamento-local";
import type { ImagemProcessada } from "@/modules/midia/domain/entities/imagem-processada.entity";

const LARGURA_DESTAQUE = 1200;
const ALTURA_DESTAQUE = 675; // proporção 16:9

export interface ProcessarImagemDestaqueInput {
  buffer: Buffer;
  mimeType: string;
  tamanhoBytes: number;
}

/**
 * Caso de uso: processar e armazenar a imagem de destaque de uma
 * notícia.
 *
 * Fluxo: validação → sharp (correção de orientação, crop 16:9 sem
 * distorção, conversão para WebP) → armazenamento local
 * (`public/uploads`, Fase 1 — Sprint 3.6).
 *
 * A tentativa de decodificação via `sharp` é, em si, uma camada de
 * validação de conteúdo real: um arquivo disfarçado (extensão/MIME
 * type falsos que não sejam uma imagem genuína) falha ao ser
 * decodificado e é rejeitado aqui, não apenas pelo MIME declarado.
 */
export class ProcessarImagemDestaqueUseCase {
  async execute(
    input: ProcessarImagemDestaqueInput,
  ): Promise<ImagemProcessada> {
    validarArquivoImagem({ type: input.mimeType, size: input.tamanhoBytes });

    let metadados: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
    try {
      metadados = await sharp(input.buffer).metadata();
    } catch {
      throw new Error(
        "Não foi possível processar o arquivo. Verifique se é uma imagem válida.",
      );
    }

    if (metadados.format === "svg") {
      throw new Error("Arquivos SVG não são permitidos.");
    }
    if (!metadados.width || !metadados.height) {
      throw new Error("Não foi possível ler as dimensões da imagem.");
    }

    const bufferProcessado = await sharp(input.buffer)
      .rotate() // corrige orientação EXIF antes do crop
      .resize(LARGURA_DESTAQUE, ALTURA_DESTAQUE, {
        // "cover" preenche exatamente 1200x675 cortando o excedente —
        // nunca estica a imagem (requisito: evitar distorção).
        fit: "cover",
        // crop inteligente: prioriza a região mais relevante da foto.
        position: "attention",
      })
      .webp({ quality: uploadConfig.qualidadeWebp })
      .toBuffer();

    const chave = gerarChaveArmazenamento("webp");
    const { url } = await salvarArquivoLocal(bufferProcessado, chave);

    return {
      url,
      largura: LARGURA_DESTAQUE,
      altura: ALTURA_DESTAQUE,
      tamanhoBytes: bufferProcessado.length,
      formato: "webp",
    };
  }
}
