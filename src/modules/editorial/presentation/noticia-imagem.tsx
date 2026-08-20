import Image from "next/image";

/**
 * Renderiza a imagem de destaque de uma notícia, com o mesmo
 * critério já usado em `/noticia/[slug]` (Sprint 3.6): imagens
 * locais (geradas pelo upload) usam `next/image`; URLs externas
 * legadas (cadastradas manualmente antes do Sprint 3.6) usam `<img>`
 * simples, para não exigir configurar `remotePatterns` para domínios
 * desconhecidos.
 *
 * Extraído como componente à parte para ser reutilizado pelos cards
 * da Home sem duplicar essa lógica — a página `/noticia/[slug]`
 * continua com sua própria implementação inline, não alterada nesta
 * Sprint.
 */
export function NoticiaImagem({
  url,
  alt,
  width,
  height,
  className,
  priority,
}: {
  url: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  if (url.startsWith("/")) {
    return (
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- URL externa legada (Sprint 3.5), fora do domínio local conhecido
    <img src={url} alt={alt} className={className} />
  );
}
