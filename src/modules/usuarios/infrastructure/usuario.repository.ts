import bcrypt from "bcryptjs";

import { prisma } from "@/shared/lib/prisma";
import {
  normalizarPaginacao,
  type ParametrosPaginacao,
  type ResultadoPaginado,
} from "@/shared/types/pagination";
import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type {
  DadosAtualizacaoUsuario,
  DadosCriacaoUsuario,
  Usuario,
} from "@/modules/usuarios/domain/entities/usuario.entity";

/**
 * Mesmo número de salt rounds já usado em `prisma/seed.ts` — único
 * outro ponto do projeto que gera hash de senha até esta Sprint.
 * Não introduz um segundo mecanismo de hashing: reutiliza bcryptjs
 * exatamente como `shared/lib/auth.ts` já usa para validar login.
 */
const SALT_ROUNDS = 10;

/**
 * Seleção de campos usada em toda leitura — exclui `senhaHash`
 * deliberadamente. Nenhum método deste repositório deve vazar o
 * hash de senha para fora da camada de infraestrutura.
 */
const SELECT_USUARIO_SEGURO = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  avatarUrl: true,
  ativo: true,
  ultimoAcesso: true,
  criadoEm: true,
  atualizadoEm: true,
} as const;

class UsuarioRepositoryPrisma implements IUsuarioRepository {
  async criar(dados: DadosCriacaoUsuario): Promise<Usuario> {
    const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

    return prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senhaHash,
        papel: dados.papel,
        avatarUrl: dados.avatarUrl ?? null,
        ativo: dados.ativo ?? true,
      },
      select: SELECT_USUARIO_SEGURO,
    });
  }

  async atualizar(
    id: string,
    dados: DadosAtualizacaoUsuario,
  ): Promise<Usuario> {
    const senhaHash = dados.senha
      ? await bcrypt.hash(dados.senha, SALT_ROUNDS)
      : undefined;

    return prisma.usuario.update({
      where: { id },
      data: {
        nome: dados.nome,
        email: dados.email,
        papel: dados.papel,
        avatarUrl: dados.avatarUrl ?? null,
        ativo: dados.ativo,
        // `undefined` faz o Prisma ignorar o campo por completo —
        // a senha atual permanece inalterada quando não informada.
        ...(senhaHash ? { senhaHash } : {}),
      },
      select: SELECT_USUARIO_SEGURO,
    });
  }

  async obterPorId(id: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
      select: SELECT_USUARIO_SEGURO,
    });
  }

  async obterPorEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
      select: SELECT_USUARIO_SEGURO,
    });
  }

  async emailJaExiste(email: string, ignorarId?: string): Promise<boolean> {
    const existente = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!existente) return false;
    if (ignorarId && existente.id === ignorarId) return false;
    return true;
  }

  async listarTodos(
    paginacao?: ParametrosPaginacao,
  ): Promise<ResultadoPaginado<Usuario>> {
    const { pagina, itensPorPagina } = normalizarPaginacao(paginacao);

    const [itens, total] = await Promise.all([
      prisma.usuario.findMany({
        orderBy: { nome: "asc" },
        skip: (pagina - 1) * itensPorPagina,
        take: itensPorPagina,
        select: SELECT_USUARIO_SEGURO,
      }),
      prisma.usuario.count(),
    ]);

    return {
      itens,
      total,
      pagina,
      itensPorPagina,
      totalPaginas: Math.max(1, Math.ceil(total / itensPorPagina)),
    };
  }

  async desativar(id: string): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: SELECT_USUARIO_SEGURO,
    });
  }

  async reativar(id: string): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: { ativo: true },
      select: SELECT_USUARIO_SEGURO,
    });
  }
}

/**
 * Instância única do repositório, pronta para ser injetada nos
 * casos de uso (Sprint 4.2).
 */
export const usuarioRepository: IUsuarioRepository =
  new UsuarioRepositoryPrisma();
