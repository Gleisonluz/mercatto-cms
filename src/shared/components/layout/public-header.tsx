import Link from "next/link";

import { appConfig } from "@/shared/config/app.config";

import { BrandLogo } from "./brand-logo";
import { obterEditoriasAtivas } from "./editorias-ativas";

/**
 * Masthead e navegação pública — Redesign, Fase 1.
 *
 * Substitui o cabeçalho de texto (Sprint 6.4) por um masthead editorial:
 * faixa preta com o logotipo oficial e o slogan, filete vermelho de 3px na
 * base da faixa e, abaixo, a barra de editorias sobre branco aquecido.
 *
 * Menu: mesmas editorias ativas e mesmos destinos (`/${slug}`) de antes. Uma
 * linha só, centralizada; quando não couber, rola na horizontal (CSS puro,
 * sem JavaScript), mantendo o componente como Server Component. Sem destaque
 * da editoria ativa, que exigiria um componente de cliente.
 */
export async function PublicHeader() {
  const editoriasAtivas = await obterEditoriasAtivas();

  return (
    <header>
      <div className="border-b-[3px] border-mercatto-red bg-mercatto-black">
        <div className="mx-auto w-full max-w-6xl px-4 pb-3.5 pt-4 text-center md:pb-[18px] md:pt-[22px]">
          <Link
            href="/"
            aria-label={`${appConfig.nome} — página inicial`}
            className="block"
          >
            <BrandLogo priority />
          </Link>
          <p className="mt-2 font-serif-display text-sm leading-[1.3] tracking-[0.02em] text-mercatto-cream md:mt-2.5 md:text-xl">
            {appConfig.slogan}
          </p>
        </div>
      </div>

      {editoriasAtivas.length > 0 && (
        <nav
          aria-label="Editorias"
          className="border-b border-mercatto-gray/25 bg-mercatto-cream"
        >
          <div className="mx-auto w-full max-w-6xl px-4">
            <ul className="nav-scroll m-0 mx-auto flex w-max max-w-full list-none overflow-x-auto p-0">
              {editoriasAtivas.map((editoria) => (
                <li key={editoria.id}>
                  <Link
                    href={`/${editoria.slug}`}
                    className="flex min-h-11 items-center whitespace-nowrap px-3.5 text-sm font-medium text-mercatto-gray hover:text-mercatto-blue hover:underline hover:underline-offset-[6px] focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-mercatto-blue"
                  >
                    {editoria.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
