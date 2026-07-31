import Link from "next/link";

const itensMenu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/noticias", label: "Notícias" },
  { href: "/editorias", label: "Editorias" },
  { href: "/empresas", label: "Empresas" },
  { href: "/publicidade", label: "Publicidade" },
  { href: "/usuarios", label: "Usuários" },
  { href: "/configuracoes", label: "Configurações" },
];

/**
 * Sidebar do painel administrativo.
 * Componente reutilizável do Design System (`shared/components/layout`).
 *
 * Nota: a filtragem de itens visíveis por papel será refinada no
 * próximo sprint, junto ao módulo `usuarios` — aqui o middleware já
 * bloqueia o acesso indevido às rotas, mas a UI ainda não esconde
 * itens que o papel atual não pode acessar.
 */
export function AdminSidebar({
  usuario,
}: {
  usuario: { nome: string; papel: string };
}) {
  return (
    <aside className="flex w-60 flex-col justify-between border-r border-gray-200 bg-white p-4">
      <div>
        <p className="mb-6 text-sm font-semibold tracking-tight">
          Mercatto CMS
        </p>
        <nav className="flex flex-col gap-1">
          {itensMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{usuario.nome}</p>
        <p>{usuario.papel}</p>
      </div>
    </aside>
  );
}
