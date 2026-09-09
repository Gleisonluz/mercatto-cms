import { gerarSlug } from "@/shared/lib/slug";
import type { IEmpresaRepository } from "@/modules/empresas/domain/repositories/empresa.repository";

/**
 * Resolve o slug final de uma empresa.
 *
 * Usa o slug informado manualmente, quando houver, ou gera
 * automaticamente a partir do nome empresarial.
 *
 * Garante unicidade adicionando um sufixo numérico em caso
 * de colisão.
 */
export async function resolverSlugUnicoEmpresa(
  empresaRepository: IEmpresaRepository,
  nomeEmpresarial: string,
  slugInformado: string | undefined,
  ignorarId?: string,
): Promise<string> {
  const base = gerarSlug(slugInformado || nomeEmpresarial);
  let candidato = base;
  let sufixo = 2;

  while (await empresaRepository.slugJaExiste(candidato, ignorarId)) {
    candidato = `${base}-${sufixo}`;
    sufixo += 1;
  }

  return candidato;
}