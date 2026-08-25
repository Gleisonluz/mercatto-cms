import type { ReactNode } from "react";
import { PublicHeader } from "@/shared/components/layout/public-header";

/**
 * Layout do grupo de rotas `(public)` — Sprint 6.4.
 *
 * Até aqui, as páginas públicas (`/`, `/[categoria]`, `/noticia/[slug]`,
 * etc.) herdavam diretamente do layout raiz, sem nenhum header ou
 * navegação em comum. Este layout adiciona `PublicHeader` acima de
 * todas elas, sem alterar nenhuma página individual.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      {children}
    </div>
  );
}
