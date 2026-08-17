"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  uploadImagemDestaqueAction,
  type EstadoUploadImagem,
} from "@/modules/midia/application/midia.actions";

const FORMATOS_ACEITOS = "image/jpeg,image/png,image/webp";
const TAMANHO_MAXIMO_MB = 10;

/**
 * Campo de upload da imagem de destaque de uma Notícia.
 *
 * Substitui o antigo input de texto "Imagem de destaque (URL)"
 * (Sprint 3.5). O upload em si é um passo independente do envio do
 * formulário principal: ao concluir, o resultado é espelhado em
 * campos ocultos (`imagemDestaqueUrl`/`imagemDestaqueAlt`), que o
 * formulário de Notícia já sabe ler — nenhuma alteração nos Use
 * Cases ou DTOs de Notícia foi necessária para essa integração.
 */
export function ImagemDestaqueField({
  valorInicial,
  altInicial,
}: {
  valorInicial?: string | null;
  altInicial?: string | null;
}) {
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [url, setUrl] = useState(valorInicial ?? "");
  const [alt, setAlt] = useState(altInicial ?? "");
  const [previewLocal, setPreviewLocal] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [dimensoes, setDimensoes] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function validarNoCliente(arquivo: File): string | null {
    if (arquivo.type === "image/svg+xml") {
      return "Arquivos SVG não são permitidos.";
    }
    if (!FORMATOS_ACEITOS.split(",").includes(arquivo.type)) {
      return "Formato não suportado. Envie um arquivo JPG, PNG ou WebP.";
    }
    if (arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      return `Imagem muito grande. O limite para upload é de ${TAMANHO_MAXIMO_MB} MB.`;
    }
    return null;
  }

  function handleSelecionarArquivo(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = event.target.files?.[0];
    event.target.value = ""; // permite selecionar o mesmo arquivo de novo depois
    if (!arquivo) return;

    const erroValidacao = validarNoCliente(arquivo);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro(null);
    setNomeArquivo(arquivo.name);
    setPreviewLocal(URL.createObjectURL(arquivo));

    const formData = new FormData();
    formData.set("arquivo", arquivo);

    startTransition(async () => {
      const resultado: EstadoUploadImagem =
        await uploadImagemDestaqueAction(formData);

      if (resultado.status === "erro") {
        setErro(resultado.mensagem);
        setPreviewLocal(null);
        setNomeArquivo(null);
        return;
      }

      setUrl(resultado.url);
      setDimensoes(`${resultado.largura}×${resultado.altura}px`);
    });
  }

  function handleRemover() {
    setUrl("");
    setAlt("");
    setPreviewLocal(null);
    setNomeArquivo(null);
    setDimensoes(null);
    setErro(null);
  }

  const imagemAtual = previewLocal ?? url;

  return (
    <div className="flex flex-col gap-3 sm:col-span-2">
      <Label htmlFor="upload-imagem-destaque">Imagem de destaque</Label>

      <input
        ref={inputArquivoRef}
        id="upload-imagem-destaque"
        type="file"
        accept={FORMATOS_ACEITOS}
        className="hidden"
        onChange={handleSelecionarArquivo}
        aria-describedby="upload-imagem-ajuda"
      />

      {imagemAtual ? (
        <div className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
          {/* Preview local (blob:) ou já processada — img simples,
              pois blob: URLs não são compatíveis com next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- pré-visualização local (blob:) antes/depois do upload */}
          <img
            src={imagemAtual}
            alt=""
            className="max-h-48 w-full rounded-md object-cover"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {nomeArquivo ?? "Imagem atual"}
              {dimensoes ? ` — ${dimensoes}` : ""}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemover}
              disabled={isPending}
            >
              <X />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputArquivoRef.current?.click()}
          disabled={isPending}
          className="w-fit"
        >
          <ImageIcon />
          Selecionar imagem
        </Button>
      )}

      {isPending && (
        <p
          className="flex items-center gap-2 text-xs text-gray-500"
          aria-live="polite"
        >
          <Loader2 className="animate-spin" />
          Enviando e otimizando imagem...
        </p>
      )}

      {!isPending && url && !erro && (
        <p className="text-xs text-green-700" aria-live="polite">
          Imagem pronta (convertida para WebP).
        </p>
      )}

      {erro && (
        <p className="text-xs text-red-600" role="alert">
          {erro}
        </p>
      )}

      <p id="upload-imagem-ajuda" className="text-xs text-gray-400">
        JPG, PNG ou WebP, até 10 MB. A imagem será recortada e otimizada
        automaticamente para 1200×675 (16:9).
      </p>

      {imagemAtual && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="imagemDestaqueAltInput">
            Texto alternativo (acessibilidade/SEO)
          </Label>
          <Input
            id="imagemDestaqueAltInput"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Descreva a imagem para leitores de tela"
          />
        </div>
      )}

      {/* Campos espelho lidos por `extrairCamposFormulario` em noticia.actions.ts */}
      <input type="hidden" name="imagemDestaqueUrl" value={url} />
      <input type="hidden" name="imagemDestaqueAlt" value={alt} />
    </div>
  );
}
