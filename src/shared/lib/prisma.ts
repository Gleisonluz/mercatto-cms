/**
 * Instância singleton do Prisma Client.
 *
 * Em desenvolvimento, o Next.js recarrega módulos a cada alteração (HMR),
 * o que criaria múltiplas conexões com o banco se não reutilizarmos a
 * instância global. Este padrão evita esgotar o pool de conexões do MySQL.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
