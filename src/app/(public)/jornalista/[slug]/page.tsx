export default async function JornalistaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-xl font-semibold">{slug}</h1>
      <p className="text-sm text-gray-500">
        Página pública de jornalista/colunista em construção.
      </p>
    </main>
  );
}
