"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import { gerarSlug } from "@/modules/editorial/domain/value-objects/slug";
import type { Editoria } from "@/modules/editorial/domain/entities/editoria.entity";
import type { EstadoFormularioEditoria } from "@/modules/editorial/application/editoria.actions";

type AcaoFormulario = (
  prevState: EstadoFormularioEditoria,
  formData: FormData,
) => Promise<EstadoFormularioEditoria>;

/**
 * Formulário reutilizável de Editoria — usado tanto em `/editorias/novo`
 * quanto em `/editorias/[id]/editar`. A diferença entre os dois casos
 * é apenas a Server Action recebida via prop `action`.
 */
export function EditoriaForm({
  editoria,
  action,
}: {
  editoria?: Editoria;
  action: AcaoFormulario;
}) {
  const [estado, formAction] = useActionState(action, {});
  const [nome, setNome] = useState(editoria?.nome ?? "");
  const [slug, setSlug] = useState(editoria?.slug ?? "");
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);
  const [ativo, setAtivo] = useState(editoria?.ativo ?? true);

  function handleNomeChange(valor: string) {
    setNome(valor);
    if (!slugEditadoManualmente) {
      setSlug(gerarSlug(valor));
    }
  }

  const erros = estado.errors ?? {};

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      {estado.message && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {estado.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            name="nome"
            required
            value={nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            placeholder="Ex.: Inteligência de Mercado"
          />
          {erros.nome && (
            <p className="text-xs text-red-600">{erros.nome[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugEditadoManualmente(true);
              setSlug(e.target.value);
            }}
            placeholder="gerado-automaticamente-a-partir-do-nome"
          />
          <p className="text-xs text-gray-400">
            Gerado automaticamente a partir do nome. Edite apenas se necessário
            — deve conter só letras minúsculas, números e hífens.
          </p>
          {erros.slug && (
            <p className="text-xs text-red-600">{erros.slug[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            name="descricao"
            defaultValue={editoria?.descricao ?? ""}
            placeholder="Breve descrição sobre o que esta editoria cobre."
            rows={3}
          />
          {erros.descricao && (
            <p className="text-xs text-red-600">{erros.descricao[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cor">Cor</Label>
          <div className="flex items-center gap-2">
            <Input
              id="cor"
              name="cor"
              type="text"
              defaultValue={editoria?.cor ?? ""}
              placeholder="#1D4ED8"
            />
          </div>
          {erros.cor && <p className="text-xs text-red-600">{erros.cor[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icone">Ícone</Label>
          <Input
            id="icone"
            name="icone"
            defaultValue={editoria?.icone ?? ""}
            placeholder="Nome do ícone (ex.: trending-up)"
          />
          {erros.icone && (
            <p className="text-xs text-red-600">{erros.icone[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="imagemCapaUrl">Imagem de capa (URL)</Label>
          <Input
            id="imagemCapaUrl"
            name="imagemCapaUrl"
            defaultValue={editoria?.imagemCapaUrl ?? ""}
            placeholder="https://..."
          />
          {erros.imagemCapaUrl && (
            <p className="text-xs text-red-600">{erros.imagemCapaUrl[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ordem">Ordem de exibição</Label>
          <Input
            id="ordem"
            name="ordem"
            type="number"
            min={0}
            defaultValue={editoria?.ordem ?? 0}
          />
          {erros.ordem && (
            <p className="text-xs text-red-600">{erros.ordem[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 sm:col-span-1">
          <div>
            <Label htmlFor="ativo">Ativo</Label>
            <p className="text-xs text-gray-400">
              Editorias inativas não aparecem no portal público.
            </p>
          </div>
          <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
          {/* Campo espelho para o FormData, já que Switch (Radix) não é um <input> nativo */}
          <input type="hidden" name="ativo" value={ativo ? "true" : "false"} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">SEO</legend>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={editoria?.seoTitle ?? ""}
            placeholder="Título para mecanismos de busca (até 70 caracteres)"
          />
          {erros.seoTitle && (
            <p className="text-xs text-red-600">{erros.seoTitle[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={editoria?.seoDescription ?? ""}
            placeholder="Descrição para mecanismos de busca (até 160 caracteres)"
            rows={2}
          />
          {erros.seoDescription && (
            <p className="text-xs text-red-600">{erros.seoDescription[0]}</p>
          )}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {editoria ? "Salvar alterações" : "Criar editoria"}
        </SubmitButton>
        <Button variant="outline" asChild type="button">
          <Link href="/editorias">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
