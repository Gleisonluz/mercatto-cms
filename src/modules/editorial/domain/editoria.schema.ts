import { z } from "zod";

/**
 * Schema de validação da Editoria — usado tanto no formulário
 * (client-side) quanto nas Server Actions (server-side), garantindo
 * uma única fonte de verdade para as regras de validação.
 *
 * O campo `slug` é opcional na entrada: quando não informado
 * manualmente, é gerado automaticamente a partir do `nome`
 * (ver `domain/value-objects/slug.ts`).
 */
export const editoriaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve possuir ao menos 2 caracteres.")
    .max(120, "O nome deve possuir no máximo 120 caracteres."),
  slug: z
    .string()
    .trim()
    .min(2, "O slug deve possuir ao menos 2 caracteres.")
    .max(140, "O slug deve possuir no máximo 140 caracteres.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "O slug deve conter apenas letras minúsculas, números e hífens.",
    )
    .optional()
    .or(z.literal("")),
  descricao: z
    .string()
    .trim()
    .max(500, "A descrição deve possuir no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
  cor: z
    .string()
    .trim()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Informe uma cor hexadecimal válida (ex.: #1D4ED8).",
    )
    .optional()
    .or(z.literal("")),
  icone: z
    .string()
    .trim()
    .max(60, "O nome do ícone deve possuir no máximo 60 caracteres.")
    .optional()
    .or(z.literal("")),
  imagemCapaUrl: z
    .string()
    .trim()
    .url("Informe uma URL válida para a imagem de capa.")
    .optional()
    .or(z.literal("")),
  ordem: z.coerce
    .number()
    .int("A ordem deve ser um número inteiro.")
    .min(0, "A ordem não pode ser negativa.")
    .default(0),
  ativo: z.coerce.boolean().default(true),
  seoTitle: z
    .string()
    .trim()
    .max(70, "O SEO Title deve possuir no máximo 70 caracteres.")
    .optional()
    .or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(160, "A SEO Description deve possuir no máximo 160 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type EditoriaFormValues = z.infer<typeof editoriaSchema>;
