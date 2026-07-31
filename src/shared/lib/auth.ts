/**
 * Configuração central do Auth.js (NextAuth v5).
 *
 * Estratégia: Credentials Provider (e-mail + senha) com sessão baseada
 * em JWT. O Prisma Adapter fica registrado para viabilizar, no futuro,
 * provedores OAuth (Google, etc.) sem retrabalho estrutural — mas o
 * fluxo de Credentials sempre exige `strategy: "jwt"` no Auth.js.
 *
 * Requisitos atendidos (01.03.1 - MVP Essencial, módulo 1: Autenticação):
 * - Login seguro
 * - Controle de sessão
 * - Base para recuperação/alteração de senha (fluxo próprio, fora do Auth.js)
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/shared/lib/prisma";
import { authConfig } from "@/shared/config/app.config";
import { loginSchema } from "@/shared/utils/validators/auth.schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: authConfig.sessaoMaxAgeSegundos,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const dadosValidados = loginSchema.safeParse(credentials);
        if (!dadosValidados.success) return null;

        const { email, senha } = dadosValidados.data;

        const usuario = await prisma.usuario.findUnique({
          where: { email },
        });

        if (!usuario || !usuario.ativo) return null;

        const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaConfere) return null;

        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { ultimoAcesso: new Date() },
        });

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          role: usuario.papel,
          image: usuario.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

/**
 * Type augmentation mínimo para os campos customizados (id, role)
 * usados nos callbacks acima. Mantido próximo à configuração para
 * facilitar manutenção — poderá ser extraído para `shared/types` se
 * crescer.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
