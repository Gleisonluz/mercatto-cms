import { z } from "zod";

/**
 * Schema de validação do formulário/credenciais de login.
 * Reutilizado tanto pelo Auth.js (authorize) quanto pelo formulário
 * de login no frontend, evitando duplicação de regras.
 */
export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(8, "A senha deve possuir ao menos 8 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema de validação para o fluxo de recuperação de senha
 * (01.03.1, módulo 1 - Autenticação).
 */
export const solicitarRecuperacaoSenhaSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

export const redefinirSenhaSchema = z
  .object({
    token: z.string().min(1, "Token inválido."),
    novaSenha: z.string().min(8, "A senha deve possuir ao menos 8 caracteres."),
    confirmarSenha: z.string().min(8),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarSenha"],
  });
