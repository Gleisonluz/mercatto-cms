"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/select";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import { gerarSlug } from "@/modules/editorial/domain/value-objects/slug";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";
import type { EstadoFormularioNoticia } from "@/modules/editorial/application/noticia.actions";

type AcaoFormulario = (
  prevState: EstadoFormularioNoticia,
  formData: FormData,
) => Promise<EstadoFormularioNoticia>;

type EditoriaOpcao = { id: string; nome: string };

const OPCOES_TIPO = [
  { value: "NOTICIA", label: "Notícia" },
  { value: "ARTIGO", label: "Artigo" },
  { value: "ENTREVISTA", label: "Entrevista" },
  { value: "REPORTAGEM_ESPECIAL", label: "Reportagem especial" },
];

const OPCOES_STATUS = [
  { value: "RASCUNHO", label: "Rascunho" },
  { value: "EM_EDICAO", label: "Em edição" },
  { value: "REVISAO", label: "Revisão" },
  { value: "AGUARDANDO_APROVACAO", label: "Aguardando aprovação" },
  { value: "AGENDADA", label: "Agendada" },
  { value: "PUBLICADA", label: "Publicada" },
  { value: "ARQUIVADA", label: "Arquivada" },
];

/**
 * Formulário reutilizável de Notícia — usado tanto em `/noticias/novo`
 * quanto em `/noticias/[id]/editar`. A diferença entre os dois casos
 * é apenas a Server Action recebida via prop `action`.
 *
 * Campos fora do escopo desta etapa (não incluídos aqui):
 * `editorResponsavelId`, `destaque`/`ordemDestaque`, galeria de
 * imagens, editor rico de conteúdo (Tiptap) e upload de arquivo.
 */
export function NoticiaForm({
  noticia,
  editorias,
  action,
}: {
  noticia?: Noticia;
  editorias: EditoriaOpcao[];
  action: AcaoFormulario;
}) {
  const [estado, formAction] = useActionState(action, {});
  const [titulo, setTitulo] = useState(noticia?.titulo ?? "");
  const [slug, setSlug] = useState(noticia?.slug ?? "");
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);

  function handleTituloChange(valor: string) {
    setTitulo(valor);
    if (!slugEditadoManualmente) {
      setSlug(gerarSlug(valor));
    }
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      {estado.message && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {estado.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input
            id="titulo"
            name="titulo"
            required
            value={titulo}
            onChange={(e) => handleTituloChange(e.target.value)}
            placeholder="Ex.: Setor de tecnologia cresce 12% em Santa Catarina"
          />
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
            placeholder="gerado-automaticamente-a-partir-do-titulo"
          />
          <p className="text-xs text-gray-400">
            Gerado automaticamente a partir do título. Edite apenas se
            necessário.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="linhaFina">Linha fina</Label>
          <Input
            id="linhaFina"
            name="linhaFina"
            defaultValue={noticia?.linhaFina ?? ""}
            placeholder="Subtítulo/deck da notícia"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="resumo">Resumo</Label>
          <Textarea
            id="resumo"
            name="resumo"
            defaultValue={noticia?.resumo ?? ""}
            placeholder="Chamada curta usada em listagens e cards"
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="conteudo">Conteúdo *</Label>
          <Textarea
            id="conteudo"
            name="conteudo"
            required
            defaultValue={noticia?.conteudo ?? ""}
            placeholder="Corpo da notícia"
            rows={12}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="editoriaId">Editoria *</Label>
          <Select
            id="editoriaId"
            name="editoriaId"
            required
            defaultValue={noticia?.editoriaId ?? ""}
          >
            <option value="" disabled>
              Selecione uma editoria
            </option>
            {editorias.map((editoria) => (
              <option key={editoria.id} value={editoria.id}>
                {editoria.nome}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            id="tipo"
            name="tipo"
            defaultValue={noticia?.tipo ?? "NOTICIA"}
          >
            {OPCOES_TIPO.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={noticia?.status ?? "RASCUNHO"}
          >
            {OPCOES_STATUS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </Select>
          <p className="text-xs text-gray-400">
            Para publicar ou arquivar, use as ações na listagem — este campo só
            altera o status manualmente.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="imagemDestaqueUrl">Imagem de destaque (URL)</Label>
          <Input
            id="imagemDestaqueUrl"
            name="imagemDestaqueUrl"
            defaultValue={noticia?.imagemDestaqueUrl ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-gray-700">SEO</legend>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={noticia?.seoTitle ?? ""}
            placeholder="Título para mecanismos de busca (até 70 caracteres)"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={noticia?.seoDescription ?? ""}
            placeholder="Descrição para mecanismos de busca (até 160 caracteres)"
            rows={2}
          />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <SubmitButton>
          {noticia ? "Salvar alterações" : "Salvar como rascunho"}
        </SubmitButton>
        <Button variant="outline" asChild type="button">
          <Link href="/noticias">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
