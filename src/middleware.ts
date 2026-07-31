/**
 * Middleware de autenticação e RBAC.
 *
 * Protege todas as rotas do grupo `(admin)` exigindo sessão ativa e,
 * quando aplicável, verificando se o papel do usuário está autorizado
 * para a seção acessada (ver `shared/config/roles.config.ts`).
 *
 * Rotas públicas e de autenticação não passam por este middleware
 * (ver `matcher` ao final do arquivo).
 */
import { NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { acessoAdminPorPapel } from "@/shared/config/roles.config";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const usuario = req.auth?.user;

  if (!usuario) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const secaoProtegida = Object.keys(acessoAdminPorPapel).find((rota) =>
    pathname.startsWith(rota),
  );

  if (secaoProtegida) {
    const papeisPermitidos = acessoAdminPorPapel[secaoProtegida];
    if (!papeisPermitidos.includes(usuario.role as never)) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/noticias/:path*",
    "/editorias/:path*",
    "/empresas/:path*",
    "/usuarios/:path*",
    "/publicidade/:path*",
    "/configuracoes/:path*",
  ],
};
