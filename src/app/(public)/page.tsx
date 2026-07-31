import { appConfig } from "@/shared/config/app.config";

/**
 * Home pública do Mercatto News.
 *
 * Sprint 1: página de fundação, sem integração editorial ainda.
 * A composição real (destaques, últimas notícias, empresas em
 * destaque, colunistas, publicidade) será implementada no módulo
 * `editorial` a partir do Sprint 2, conforme 01.03.1 (seção 11).
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{appConfig.nome}</h1>
      <p className="max-w-xl text-balance text-gray-600">
        {appConfig.descricaoCurta}
      </p>
      <p className="text-sm text-gray-400">
        Fundação do Mercatto CMS — Sprint 1 em andamento.
      </p>
    </main>
  );
}
