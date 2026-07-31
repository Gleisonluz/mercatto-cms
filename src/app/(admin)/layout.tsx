import type { ReactNode } from "react";
import { auth } from "@/shared/lib/auth";
import { AdminSidebar } from "@/shared/components/layout/admin-sidebar";

/**
 * Layout do grupo de rotas `(admin)`.
 * A proteção de acesso já ocorre no middleware (`src/middleware.ts`);
 * aqui buscamos a sessão apenas para exibir os dados do usuário na UI.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        usuario={{
          nome: session?.user?.name ?? "Usuário",
          papel: session?.user?.role ?? "",
        }}
      />
      <div className="flex-1 bg-gray-50 p-6">{children}</div>
    </div>
  );
}
