import { uploadConfig } from "@/shared/config/app.config";

/**
 * Erro de domínio para arquivo de upload inválido. Mensagens já em
 * formato apresentável ao usuário final (jornalista), conforme
 * exigido pela Sprint 3.6.
 */
export class ArquivoInvalidoError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ArquivoInvalidoError";
  }
}

/**
 * Validação de primeira camada: tipo declarado e tamanho do arquivo,
 * usando os limites já definidos em `uploadConfig` (Sprint 1).
 *
 * Esta validação, por si só, não é suficiente para garantir que o
 * conteúdo é realmente uma imagem válida — isso é responsibility do
 * `ProcessarImagemDestaqueUseCase`, que tenta decodificar o arquivo
 * com `sharp` e rejeita qualquer conteúdo que não seja uma imagem
 * genuína (não confia apenas no MIME type declarado pelo navegador).
 */
export function validarArquivoImagem(arquivo: {
  type: string;
  size: number;
}): void {
  if (arquivo.type === "image/svg+xml") {
    throw new ArquivoInvalidoError("Arquivos SVG não são permitidos.");
  }

  if (!(uploadConfig.formatosPermitidos as readonly string[]).includes(arquivo.type)) {
    throw new ArquivoInvalidoError(
      "Formato não suportado. Envie um arquivo JPG, PNG ou WebP.",
    );
  }

  const tamanhoMaximoBytes = uploadConfig.tamanhoMaximoMB * 1024 * 1024;
  if (arquivo.size > tamanhoMaximoBytes) {
    throw new ArquivoInvalidoError(
      `Imagem muito grande. O limite para upload é de ${uploadConfig.tamanhoMaximoMB} MB.`,
    );
  }
}
