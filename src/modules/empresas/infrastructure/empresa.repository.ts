import { prisma } from "@/shared/lib/prisma";
import {
  normalizarPaginacao,
  type ParametrosPaginacao,
  type ResultadoPaginado,
} from "@/shared/types/pagination";
import type { IEmpresaRepository } from "@/modules/empresas/domain/repositories/empresa.repository";
import type {
  DadosEmpresa,
  Empresa,
} from "@/modules/empresas/domain/entities/empresa.entity";

class EmpresaRepositoryPrisma implements IEmpresaRepository {
  async criar(
    dados: DadosEmpresa & { slug: string },
  ): Promise<Empresa> {
    return prisma.empresa.create({
      data: {
        nomeEmpresarial: dados.nomeEmpresarial,
        slug: dados.slug,
        logotipoUrl: dados.logotipoUrl ?? null,
        fotografiaCapaUrl: dados.fotografiaCapaUrl ?? null,
        segmentoAtuacao: dados.segmentoAtuacao ?? null,
        cidade: dados.cidade ?? null,
        estado: dados.estado ?? null,
        descricaoInstitucional: dados.descricaoInstitucional ?? null,
        siteOficial: dados.siteOficial ?? null,
        redesSociais: dados.redesSociais ?? null,
        contatos: dados.contatos ?? null,
        localizacao: dados.localizacao ?? null,
        selosCertificacoes: dados.selosCertificacoes ?? null,
        esg: dados.esg ?? null,
        status: dados.status ?? "ATIVA",
      },
    });
  }

  async atualizar(
    id: string,
    dados: DadosEmpresa & { slug: string },
  ): Promise<Empresa> {
    return prisma.empresa.update({
      where: { id },
      data: {
        nomeEmpresarial: dados.nomeEmpresarial,
        slug: dados.slug,
        logotipoUrl: dados.logotipoUrl ?? null,
        fotografiaCapaUrl: dados.fotografiaCapaUrl ?? null,
        segmentoAtuacao: dados.segmentoAtuacao ?? null,
        cidade: dados.cidade ?? null,
        estado: dados.estado ?? null,
        descricaoInstitucional: dados.descricaoInstitucional ?? null,
        siteOficial: dados.siteOficial ?? null,
        redesSociais: dados.redesSociais ?? null,
        contatos: dados.contatos ?? null,
        localizacao: dados.localizacao ?? null,
        selosCertificacoes: dados.selosCertificacoes ?? null,
        esg: dados.esg ?? null,
        status: dados.status,
      },
    });
  }

  async obterPorId(id: string): Promise<Empresa | null> {
    return prisma.empresa.findUnique({
      where: { id },
    });
  }

  async obterPorSlug(slug: string): Promise<Empresa | null> {
    return prisma.empresa.findUnique({
      where: { slug },
    });
  }

  async slugJaExiste(
    slug: string,
    ignorarId?: string,
  ): Promise<boolean> {
    const existente = await prisma.empresa.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existente) return false;
    if (ignorarId && existente.id === ignorarId) return false;

    return true;
  }

  async listarTodos(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Empresa>> {
    const { pagina, itensPorPagina } = normalizarPaginacao(paginacao);

    const [itens, total] = await Promise.all([
      prisma.empresa.findMany({
        orderBy: { nomeEmpresarial: "asc" },
        skip: (pagina - 1) * itensPorPagina,
        take: itensPorPagina,
      }),
      prisma.empresa.count(),
    ]);

    return {
      itens,
      total,
      pagina,
      itensPorPagina,
      totalPaginas: Math.max(1, Math.ceil(total / itensPorPagina)),
    };
  }

  async desativar(id: string): Promise<Empresa> {
    return prisma.empresa.update({
      where: { id },
      data: { status: "INATIVA" },
    });
  }

  async reativar(id: string): Promise<Empresa> {
    return prisma.empresa.update({
      where: { id },
      data: { status: "ATIVA" },
    });
  }
}

export const empresaRepository: IEmpresaRepository =
  new EmpresaRepositoryPrisma();