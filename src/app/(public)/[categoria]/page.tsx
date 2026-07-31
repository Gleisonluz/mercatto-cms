export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-xl font-semibold capitalize">{categoria}</h1>
      <p className="text-sm text-gray-500">Editoria em construção.</p>
    </main>
  );
}
