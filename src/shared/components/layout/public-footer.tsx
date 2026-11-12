import Link from "next/link";

import { appConfig } from "@/shared/config/app.config";

import { BrandLogo } from "./brand-logo";
import { obterEditoriasAtivas } from "./editorias-ativas";

/**
 * Rodapé institucional — Redesign, Fase 1.
 *
 * Usa somente informações e destinos que já existem: logotipo, slogan,
 * `appConfig.descricaoCurta`, link para `/` e as editorias ativas
 * (`/${slug}`). Ainda não há páginas institucionais (Sobre, Contato,
 * Privacidade), nem e-mail, redes sociais ou dados legais no projeto, então
 * nada disso é exibido nem inventado.
 *
 * Mesma faixa preta do masthead, em layout centralizado.
 */
export async function PublicFooter() {
  const editoriasAtivas = await obterEditoriasAtivas();
  const ano = new Date().getFullYear();

  const linkClasses =
    "inline-flex min-h-11 items-center px-3 text-sm text-mercatto-cream/80 hover:text-mercatto-cream hover:underline hover:underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mercatto-cream";

  return (
    <footer className="mt-auto bg-mercatto-black text-mercatto-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 pb-8 pt-10 text-center">
        <div>
          <BrandLogo tamanho="rodape" />
          <p className="mt-2 font-serif-display text-sm leading-[1.3] tracking-[0.02em] md:text-base">
            {appConfig.slogan}
          </p>
        </div>

        <p className="max-w-xl text-sm text-mercatto-cream/80">
          {appConfig.descricaoCurta}
        </p>

        <nav aria-label="Editorias (rodapé)">
          <h2 className="mb-1 font-serif-display text-base">Editorias</h2>
          <ul className="flex flex-wrap justify-center">
            <li>
              <Link href="/" className={linkClasses}>
                Início
              </Link>
            </li>
            {editoriasAtivas.map((editoria) => (
              <li key={editoria.id}>
                <Link href={`/${editoria.slug}`} className={linkClasses}>
                  {editoria.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="w-full border-t border-mercatto-cream/15 pt-6 text-xs text-mercatto-cream/70">
          © {ano} {appConfig.nome}
        </p>
      </div>
    </footer>
  );
}
