"use client";

import { useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Plus, Send, Archive } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  excluirNoticiaAction,
  publicarNoticiaAction,
  arquivarNoticiaAction,
} from "@/modules/editorial/application/noticia.actions";
import type { Noticia } from "@/modules/editorial/domain/entities/noticia.entity";

const RES_STATUS: Record<
  Noticia["status"],
  { label: string; variant: "default" | "success" | "muted" | "destructive" }
> = {
  RASCUNHO: { label: "Rascunho", variant: "muted" },
  EM_EDICAO: { label: "Em edição", variant: "default" },
  REVISAO: { label: "Revisão", variant: "default" },
  AGUARDANDO_APROVACAO: { label: "Aguardando aprovação", variant: "default" },
  AGENDADA: { label: "Agendada", variant: "default" },
  PUBLICADA: { label: "Publicada", variant: "success" },
  ARQUIVADA: { label: "Arquivada", variant: "destructive" },
};

const RES_TIPO: Record<Noticia["tipo"], string> = {
  NOTICIA: "Notícia",
  ARTIGO: "Artigo",
  ENTREVISTA: "Entrevista",
  REPORTAGEM_ESPECIAL: "Reportagem especial",
};

export function NoticiasTable({
  noticias,
  editoriasPorId,
}: {
  noticias: Noticia[];
  editoriasPorId: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/noticias/novo">
            <Plus />
            Nova Notícia
          </Link>
        </Button>
      </div>

      {noticias.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Nenhuma notícia encontrada para este filtro.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Editoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {noticias.map((noticia) => (
              <NoticiaRow
                key={noticia.id}
                noticia={noticia}
                nomeEditoria={editoriasPorId[noticia.editoriaId] ?? "—"}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function NoticiaRow({
  noticia,
  nomeEditoria,
}: {
  noticia: Noticia;
  nomeEditoria: string;
}) {
  const [isPending, startTransition] = useTransition();
  const statusInfo = RES_STATUS[noticia.status];

  const data = noticia.publicadoEm ?? noticia.criadoEm;
  const rotuloData = noticia.publicadoEm ? "Publicada em" : "Criada em";

  function handlePublicar() {
    startTransition(() => {
      publicarNoticiaAction(noticia.id);
    });
  }

  function handleArquivar() {
    startTransition(() => {
      arquivarNoticiaAction(noticia.id);
    });
  }

  function handleExcluir() {
    startTransition(() => {
      excluirNoticiaAction(noticia.id);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-gray-900">
        {noticia.titulo}
      </TableCell>
      <TableCell>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </TableCell>
      <TableCell className="text-gray-500">{RES_TIPO[noticia.tipo]}</TableCell>
      <TableCell className="text-gray-500">{nomeEditoria}</TableCell>
      <TableCell className="text-gray-500">
        <span title={rotuloData}>
          {format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link
              href={`/noticias/${noticia.id}/editar`}
              aria-label={`Editar ${noticia.titulo}`}
            >
              <Pencil />
            </Link>
          </Button>

          {noticia.status !== "PUBLICADA" && (
            <Button
              variant="outline"
              size="icon"
              aria-label={`Publicar ${noticia.titulo}`}
              onClick={handlePublicar}
              disabled={isPending}
            >
              <Send />
            </Button>
          )}

          {noticia.status === "PUBLICADA" && (
            <Button
              variant="outline"
              size="icon"
              aria-label={`Arquivar ${noticia.titulo}`}
              onClick={handleArquivar}
              disabled={isPending}
            >
              <Archive />
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Excluir ${noticia.titulo}`}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir notícia</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir{" "}
                  <strong>{noticia.titulo}</strong>? Esta ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleExcluir} disabled={isPending}>
                  {isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
