export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-xl font-semibold">{slug}</h1>
      <p className="text-sm text-gray-500">
        Página institucional de empresa em construção (módulo empresas ⭐).
      </p>
    </main>
  );
}
