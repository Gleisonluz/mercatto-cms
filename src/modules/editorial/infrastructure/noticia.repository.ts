import { prisma } from "@/shared/lib/prisma";
import {
  normalizarPaginacao,
  type ParametrosPaginacao,
  type ResultadoPaginado,
} from "@/shared/types/pagination";
import type { INoticiaRepository } from "@/modules/editorial/domain/repositories/noticia.repository";
import type {
  DadosNoticia,
  Noticia,
  StatusNoticia,
} from "@/modules/editorial/domain/entities/noticia.entity";

/**
 * Implementação Prisma do repositório de Notícia.
 *
 * Única camada do módulo com acesso direto ao Prisma para a entidade
 * Noticia. Casos de uso (a serem criados no Sprint 3.3) devem
 * depender da interface `INoticiaRepository`, nunca desta classe
 * diretamente — isso preserva a inversão de dependência.
 */
class NoticiaRepositoryPrisma implements INoticiaRepository {
  async criar(dados: DadosNoticia & { slug: string }): Promise<Noticia> {
    return prisma.noticia.create({
      data: {
        titulo: dados.titulo,
        slug: dados.slug,
        linhaFina: dados.linhaFina ?? null,
        resumo: dados.resumo ?? null,
        conteudo: dados.conteudo,
        tipo: dados.tipo ?? "NOTICIA",
        status: dados.status ?? "RASCUNHO",
        imagemDestaqueUrl: dados.imagemDestaqueUrl ?? null,
        imagemDestaqueAlt: dados.imagemDestaqueAlt ?? null,
        imagemDestaqueCredito: dados.imagemDestaqueCredito ?? null,
        destaque: dados.destaque ?? false,
        ordemDestaque: dados.ordemDestaque ?? null,
        tempoLeituraMinutos: dados.tempoLeituraMinutos ?? null,
        seoTitle: dados.seoTitle ?? null,
        seoDescription: dados.seoDescription ?? null,
        seoCanonicalUrl: dados.seoCanonicalUrl ?? null,
        publicadoEm: dados.publicadoEm ?? null,
        agendadoPara: dados.agendadoPara ?? null,
        editoriaId: dados.editoriaId,
        autorId: dados.autorId,
        editorResponsavelId: dados.editorResponsavelId ?? null,
      },
    });
  }

  async atualizar(
    id: string,
    dados: DadosNoticia & { slug: string },
  ): Promise<Noticia> {
    return prisma.noticia.update({
      where: { id },
      data: {
        titulo: dados.titulo,
        slug: dados.slug,
        linhaFina: dados.linhaFina ?? null,
        resumo: dados.resumo ?? null,
        conteudo: dados.conteudo,
        tipo: dados.tipo ?? "NOTICIA",
        status: dados.status ?? "RASCUNHO",
        imagemDestaqueUrl: dados.imagemDestaqueUrl ?? null,
        imagemDestaqueAlt: dados.imagemDestaqueAlt ?? null,
        imagemDestaqueCredito: dados.imagemDestaqueCredito ?? null,
        destaque: dados.destaque ?? false,
        ordemDestaque: dados.ordemDestaque ?? null,
        tempoLeituraMinutos: dados.tempoLeituraMinutos ?? null,
        seoTitle: dados.seoTitle ?? null,
        seoDescription: dados.seoDescription ?? null,
        seoCanonicalUrl: dados.seoCanonicalUrl ?? null,
        publicadoEm: dados.publicadoEm ?? null,
        agendadoPara: dados.agendadoPara ?? null,
        editoriaId: dados.editoriaId,
        autorId: dados.autorId,
        editorResponsavelId: dados.editorResponsavelId ?? null,
      },
    });
  }

  async excluir(id: string): Promise<void> {
    await prisma.noticia.delete({ where: { id } });
  }

  async obterPorId(id: string): Promise<Noticia | null> {
    return prisma.noticia.findUnique({ where: { id } });
  }

  async obterPorSlug(slug: string): Promise<Noticia | null> {
    return prisma.noticia.findUnique({ where: { slug } });
  }

  async slugJaExiste(slug: string, ignorarId?: string): Promise<boolean> {
    const existente = await prisma.noticia.findUnique({ where: { slug } });
    if (!existente) return false;
    if (ignorarId && existente.id === ignorarId) return false;
    return true;
  }

  async listarPorStatus(
    status: StatusNoticia,
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>> {
    return this.paginar({ status }, paginacao);
  }

  async listarTodas(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>> {
    return this.paginar({}, paginacao);
  }

  async listarPorEditoria(
    editoriaId: string,
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>> {
    return this.paginar({ editoriaId }, paginacao);
  }

  async listarDestaques(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>> {
    return this.paginar({ destaque: true, status: "PUBLICADA" }, paginacao, [
      { ordemDestaque: "asc" },
      { publicadoEm: "desc" },
    ]);
  }

  async listarPublicadas(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Noticia>> {
    return this.paginar({ status: "PUBLICADA" }, paginacao, [
      { publicadoEm: "desc" },
    ]);
  }

  /**
   * Helper interno de paginação, reutilizado por todos os métodos de
   * listagem filtrada. Mantém a lógica de contagem + paginação em um
   * único lugar, evitando duplicação (DRY).
   */
  private async paginar(
    where: Record<string, unknown>,
    paginacao?: ParametrosPaginacao,
    orderBy: Record<string, "asc" | "desc">[] = [{ criadoEm: "desc" }],
  ): Promise<ResultadoPaginado<Noticia>> {
    const { pagina, itensPorPagina } = normalizarPaginacao(paginacao);

    const [itens, total] = await Promise.all([
      prisma.noticia.findMany({
        where,
        orderBy,
        skip: (pagina - 1) * itensPorPagina,
        take: itensPorPagina,
      }),
      prisma.noticia.count({ where }),
    ]);

    return {
      itens,
      total,
      pagina,
      itensPorPagina,
      totalPaginas: Math.max(1, Math.ceil(total / itensPorPagina)),
    };
  }
}

/**
 * Instância única do repositório, pronta para ser injetada nos
 * casos de uso (Sprint 3.3).
 */
export const noticiaRepository: INoticiaRepository =
  new NoticiaRepositoryPrisma();
