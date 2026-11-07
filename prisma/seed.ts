/**
 * Mercatto CMS - Seed inicial
 * Cria o primeiro usuário Super Administrador para acesso ao sistema.
 * Executar com: npm run db:seed
 */
import "dotenv/config";
import { PrismaClient, Papel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaInicial = process.env.ADMIN_INITIAL_PASSWORD;

  if (!senhaInicial) {
    throw new Error(
      "A variável ADMIN_INITIAL_PASSWORD não está configurada no .env.",
    );
  }

  const senhaHash = await bcrypt.hash(senhaInicial, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@mercattonews.com.br" },
    update: {},
    create: {
      nome: "Administrador Mercatto",
      email: "admin@mercattonews.com.br",
      senhaHash,
      papel: Papel.SUPER_ADMINISTRADOR,
    },
  });

  console.log("Usuário Super Administrador criado:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });