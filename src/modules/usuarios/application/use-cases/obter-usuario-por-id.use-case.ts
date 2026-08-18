import type { IUsuarioRepository } from "@/modules/usuarios/domain/repositories/usuario.repository";
import type { Usuario } from "@/modules/usuarios/domain/entities/usuario.entity";

export interface ObterUsuarioPorIdInput {
  id: string;
}

/**
 * Caso de uso: obter um usuário pelo id.
 * Retorna `null` quando não encontrado — a decisão de tratar isso
 * como 404 ou outro comportamento cabe à camada que consumir este
 * Use Case, fora do escopo desta etapa.
 */
export class ObterUsuarioPorIdUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(input: ObterUsuarioPorIdInput): Promise<Usuario | null> {
    return this.usuarioRepository.obterPorId(input.id);
  }
}
