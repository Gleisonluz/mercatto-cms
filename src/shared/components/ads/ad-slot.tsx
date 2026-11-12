import { cn } from "@/shared/lib/cn";

/**
 * Espaço publicitário horizontal — Redesign, Fase 1 (somente apresentação).
 *
 * Tamanhos reservados por faixa de largura (CSS):
 *  - mobile (< 768px):   320×100
 *  - tablet (768–1023):  728×90
 *  - desktop (≥ 1024px): 970×90
 *
 * O espaço fica SEMPRE reservado, inclusive em produção e sem criativo:
 * mostra só o rótulo "PUBLICIDADE" e uma área discreta, sem imagem fictícia,
 * texto promocional ou link. Estado vazio e estado com criativo usam a mesma
 * caixa, então não há deslocamento de layout quando um anúncio entrar.
 *
 * Fora do escopo desta fase: campanhas, rotação, métricas e AdSense. O
 * componente não busca dados: quem o usa decide se passa um `criativo`.
 *
 * O componente não define largura máxima nem padding laterais: o contêiner
 * da página (ex.: `main` da home) já os fornece.
 */

type ImagemCriativo = {
  src: string;
  width: number;
  height: number;
};

export type CriativoPublicitario = {
  /** Texto alternativo da peça. */
  alt: string;
  /** Destino do clique (opcional). Abre em nova aba com `rel="sponsored noopener"`. */
  href?: string;
  /** Uma arte por tamanho: 970×90, 728×90 e 320×100 (ou o dobro, para telas 2x). */
  desktop: ImagemCriativo;
  tablet: ImagemCriativo;
  mobile: ImagemCriativo;
};

const CAIXA =
  "mx-auto h-[100px] w-[320px] max-w-full md:h-[90px] md:w-[728px] lg:w-[970px]";

export function AdSlot({ criativo }: { criativo?: CriativoPublicitario }) {
  return (
    <aside
      aria-label="Publicidade"
      // Sem criativo, a área é só decorativa: não deve ser anunciada por leitores de tela.
      aria-hidden={criativo ? undefined : true}
      className="text-center"
    >
      <span className="mb-1.5 block text-[11px] uppercase leading-4 tracking-[0.12em] text-mercatto-gray">
        Publicidade
      </span>

      {criativo ? (
        <Criativo criativo={criativo} />
      ) : (
        <div
          className={cn(CAIXA, "border border-mercatto-gray/[.28] bg-mercatto-gray/[.06]")}
        />
      )}
    </aside>
  );
}

function Criativo({ criativo }: { criativo: CriativoPublicitario }) {
  const imagem = (
    <picture>
      <source media="(min-width: 1024px)" srcSet={criativo.desktop.src} />
      <source media="(min-width: 768px)" srcSet={criativo.tablet.src} />
      { }
      <img
        src={criativo.mobile.src}
        alt={criativo.alt}
        width={criativo.mobile.width}
        height={criativo.mobile.height}
        decoding="async"
        className="block h-full w-full object-contain"
      />
    </picture>
  );

  if (criativo.href) {
    return (
      <a
        href={criativo.href}
        target="_blank"
        rel="sponsored noopener"
        className={cn(CAIXA, "block")}
      >
        {imagem}
      </a>
    );
  }

  return <div className={CAIXA}>{imagem}</div>;
}
