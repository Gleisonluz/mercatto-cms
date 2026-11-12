import type { ReactNode } from "react";
import { Playfair_Display } from "next/font/google";

import { PublicFooter } from "@/shared/components/layout/public-footer";
import { PublicHeader } from "@/shared/components/layout/public-header";

/**
 * Fonte serifada do portal (slogan e títulos de seção do rodapé) — Redesign,
 * Fase 1. Declarada aqui, e não no layout raiz, para que o admin não a
 * carregue. O `next/font/google` baixa o arquivo no build e o serve do
 * próprio domínio (mesmo mecanismo já usado pela Geist no layout raiz).
 * Playfair Display é fonte variável: não é preciso listar pesos.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Layout do grupo de rotas `(public)` — Sprint 6.4.
 *
 * Até aqui, as páginas públicas (`/`, `/[categoria]`, `/noticia/[slug]`,
 * etc.) herdavam diretamente do layout raiz, sem nenhum header ou
 * navegação em comum. Este layout adiciona `PublicHeader` acima de
 * todas elas, sem alterar nenhuma página individual.
 *
 * Redesign, Fase 1: o wrapper `.portal` marca o portal público para os
 * estilos de `globals.css` (fundo branco aquecido, sem modo escuro
 * automático) e aplica a Geist como fonte de interface; o rodapé
 * institucional fecha a página.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${playfair.variable} portal flex min-h-screen flex-col bg-mercatto-cream font-sans text-mercatto-ink`}
    >
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
