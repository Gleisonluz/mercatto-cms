/**
 * Mercatto CMS - Seed inicial
 * Cria o primeiro usuário Super Administrador para acesso ao sistema.
 * Executar com: npm run db:seed
 */
import { PrismaClient, Papel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("troque-esta-senha", 10);

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

  console.log("Usuário Super Administrador criado/atualizado:", admin.email);
  console.log(
    "IMPORTANTE: altere a senha padrão imediatamente após o primeiro login.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
