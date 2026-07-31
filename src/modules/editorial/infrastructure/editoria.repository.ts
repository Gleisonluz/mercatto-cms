import { prisma } from "@/shared/lib/prisma";
import type {
  DadosEditoria,
  Editoria,
} from "@/modules/editorial/domain/entities/editoria.entity";

/**
 * Repositório de Editoria — única camada do módulo com acesso direto
 * ao Prisma. Casos de uso (`application/`) nunca devem importar
 * `@/shared/lib/prisma` diretamente; sempre passam por aqui.
 */

export async function listarEditorias(): Promise<
  (Editoria & { quantidadeNoticias: number })[]
> {
  const editorias = await prisma.editoria.findMany({
    orderBy: [{ ordem: "asc" }, { nome: "asc" }],
  });

  // NOTA: o model `Noticia` ainda não existe (será criado no módulo
  // editorial de notícias, Sprint 3+). Até lá, a contagem é sempre 0.
  return editorias.map((editoria: Editoria) => ({
    ...editoria,
    quantidadeNoticias: 0,
  }));
}

export async function obterEditoriaPorId(id: string): Promise<Editoria | null> {
  return prisma.editoria.findUnique({ where: { id } });
}

export async function obterEditoriaPorSlug(
  slug: string,
): Promise<Editoria | null> {
  return prisma.editoria.findUnique({ where: { slug } });
}

export async function slugJaExiste(
  slug: string,
  ignorarId?: string,
): Promise<boolean> {
  const existente = await prisma.editoria.findUnique({ where: { slug } });
  if (!existente) return false;
  if (ignorarId && existente.id === ignorarId) return false;
  return true;
}

export async function criarEditoria(dados: DadosEditoria & { slug: string }) {
  return prisma.editoria.create({
    data: {
      nome: dados.nome,
      slug: dados.slug,
      descricao: dados.descricao ?? null,
      cor: dados.cor ?? null,
      icone: dados.icone ?? null,
      imagemCapaUrl: dados.imagemCapaUrl ?? null,
      ordem: dados.ordem ?? 0,
      ativo: dados.ativo ?? true,
      seoTitle: dados.seoTitle ?? null,
      seoDescription: dados.seoDescription ?? null,
    },
  });
}

export async function atualizarEditoria(
  id: string,
  dados: DadosEditoria & { slug: string },
) {
  return prisma.editoria.update({
    where: { id },
    data: {
      nome: dados.nome,
      slug: dados.slug,
      descricao: dados.descricao ?? null,
      cor: dados.cor ?? null,
      icone: dados.icone ?? null,
      imagemCapaUrl: dados.imagemCapaUrl ?? null,
      ordem: dados.ordem ?? 0,
      ativo: dados.ativo ?? true,
      seoTitle: dados.seoTitle ?? null,
      seoDescription: dados.seoDescription ?? null,
    },
  });
}

export async function excluirEditoria(id: string) {
  return prisma.editoria.delete({ where: { id } });
}
