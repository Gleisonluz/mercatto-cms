import Image from "next/image";

import { appConfig } from "@/shared/config/app.config";
import { cn } from "@/shared/lib/cn";

/**
 * Logotipo oficial — Redesign, Fase 1.
 *
 * Usa `public/brand/mercatto-news-logo.svg` exatamente como recebido (cópia
 * byte a byte; sem redesenho, recolorização ou recorte do arquivo). O SVG tem
 * margens transparentes e leve desvio à direita (≈23% do topo, ≈18% da base e
 * ≈2,2% lateral), compensadas apenas por CSS.
 *
 * `--logo-w` é a largura do ARQUIVO. A parte visível ocupa ≈81% dela:
 *  - masthead: 272px no mobile (≈220px visíveis) e 520px a partir de `md`
 *    (≈421px visíveis);
 *  - rodapé: 272px em qualquer tela.
 *
 * O logotipo tem "NEWS" em branco aquecido: só deve ser usado sobre fundo
 * escuro (faixa preta do masthead e do rodapé).
 *
 * `unoptimized`: o Next não otimiza SVG; o arquivo é servido como está.
 */
const TAMANHOS = {
  masthead: "[--logo-w:272px] md:[--logo-w:520px]",
  rodape: "[--logo-w:272px]",
} as const;

type BrandLogoProps = {
  tamanho?: keyof typeof TAMANHOS;
  /** Use `true` apenas para o logotipo acima da dobra (cabeçalho). */
  priority?: boolean;
  className?: string;
};

export function BrandLogo({
  tamanho = "masthead",
  priority = false,
  className,
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/mercatto-news-logo.svg"
      alt={appConfig.nome}
      width={900}
      height={250}
      unoptimized
      priority={priority}
      className={cn(
        TAMANHOS[tamanho],
        "mx-auto block h-auto w-[var(--logo-w)] -translate-x-[2.2%]",
        "mt-[calc(var(--logo-w)*-0.064)] mb-[calc(var(--logo-w)*-0.051)]",
        className,
      )}
    />
  );
}
